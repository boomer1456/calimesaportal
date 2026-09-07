import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTrainingStore, type Tab } from "@/lib/store";

type Layer = { alive: boolean; close: () => void };

type Hist = { cfd: 1; tab: Tab | "home"; layer: number };

type BackApi = {
  go: () => boolean;
  nested: boolean;
  register: (close: () => void) => () => void;
};

const BackCtx = createContext<BackApi | null>(null);

/** Grok’s chat pane owns Back. Safari / the Home Screen icon do not. */
function isFramed(): boolean {
  try {
    return window.parent !== window;
  } catch {
    return true;
  }
}

function readHist(): Hist {
  const s = history.state as Hist | null;
  if (s && s.cfd === 1) return s;
  return { cfd: 1, tab: "home", layer: 0 };
}

function here(tab: Tab | "home", layer: number): Hist {
  return { cfd: 1, tab, layer };
}

function pushHist(state: Hist) {
  if (isFramed()) return;
  history.pushState(state, "");
}

function replaceHist(state: Hist) {
  if (isFramed()) return;
  history.replaceState(state, "");
}

export function BackStackProvider({ children }: { children: ReactNode }) {
  const layersRef = useRef<Layer[]>([]);
  const restoringRef = useRef(false);
  const ignorePopRef = useRef(false);
  const [nested, setNested] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);

  const syncNested = useCallback(() => {
    setNested(layersRef.current.length > 0);
  }, []);

  const register = useCallback(
    (close: () => void) => {
      const layer: Layer = { alive: true, close };
      layersRef.current.push(layer);
      const tab = useTrainingStore.getState().tab;
      pushHist(here(tab, layersRef.current.length));
      syncNested();
      return () => {
        if (!layer.alive) return;
        layer.alive = false;
        const idx = layersRef.current.indexOf(layer);
        if (idx >= 0) layersRef.current.splice(idx, 1);
        syncNested();
        if (idx === layersRef.current.length) {
          if (isFramed()) return;
          ignorePopRef.current = true;
          history.back();
        }
      };
    },
    [syncNested],
  );

  const go = useCallback(() => {
    if (isFramed()) {
      if (layersRef.current.length > 0) {
        const layer = layersRef.current.pop();
        if (layer?.alive) {
          layer.alive = false;
          layer.close();
        }
        syncNested();
        return true;
      }
      if (useTrainingStore.getState().tab !== "home") {
        useTrainingStore.getState().goHome();
        return true;
      }
      return false;
    }
    const tab = useTrainingStore.getState().tab;
    if (layersRef.current.length > 0 || tab !== "home") {
      history.back();
      return true;
    }
    return false;
  }, [syncNested]);

  useEffect(() => {
    if (!history.state || history.state.cfd !== 1) {
      replaceHist(here("home", 0));
    }

    let prevTab = useTrainingStore.getState().tab;
    const unsub = useTrainingStore.subscribe((s) => {
      if (restoringRef.current) {
        prevTab = s.tab;
        return;
      }
      if (s.tab === prevTab) return;
      prevTab = s.tab;
      if (s.tab === "home") return;
      for (const layer of layersRef.current) layer.alive = false;
      layersRef.current = [];
      syncNested();
      pushHist(here(s.tab, 0));
    });

    function onPop() {
      if (isFramed()) return;
      if (ignorePopRef.current) {
        ignorePopRef.current = false;
        return;
      }
      const st = readHist();
      const want = st.layer ?? 0;
      while (layersRef.current.length > want) {
        const layer = layersRef.current.pop();
        if (layer?.alive) {
          layer.alive = false;
          layer.close();
        }
      }
      syncNested();
      restoringRef.current = true;
      const store = useTrainingStore.getState();
      if (st.tab === "home") {
        if (store.tab !== "home") store.goHome();
      } else if (store.tab !== st.tab) {
        store.setTab(st.tab);
      }
      restoringRef.current = false;
    }

    window.addEventListener("popstate", onPop);
    return () => {
      unsub();
      window.removeEventListener("popstate", onPop);
    };
  }, [syncNested]);

  useEffect(() => {
    const EDGE = 32;
    const THRESHOLD = 72;
    const hint = hintRef.current;
    let pid: number | null = null;
    let x0 = 0;
    let y0 = 0;
    let locked = false;

    function canGoNow() {
      return (
        layersRef.current.length > 0 || useTrainingStore.getState().tab !== "home"
      );
    }

    function setHint(dx: number) {
      if (!hint) return;
      const t = Math.max(0, Math.min(1, dx / 140));
      hint.style.opacity = String(0.25 + t * 0.75);
      hint.style.transform = `translate(${Math.min(dx, 120) - 28}px, -50%)`;
    }

    function clearHint() {
      if (!hint) return;
      hint.style.opacity = "0";
      hint.style.transform = "translate(-28px, -50%)";
    }

    function down(e: PointerEvent) {
      if (pid !== null) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.clientX > EDGE) return;
      if (!canGoNow()) return;
      pid = e.pointerId;
      x0 = e.clientX;
      y0 = e.clientY;
      locked = false;
    }

    function move(e: PointerEvent) {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - x0;
      const dy = e.clientY - y0;
      if (!locked) {
        if (Math.abs(dy) > 20 && Math.abs(dy) > Math.abs(dx)) {
          pid = null;
          clearHint();
          return;
        }
        if (dx > 14) locked = true;
      }
      if (locked) {
        if (e.cancelable) e.preventDefault();
        setHint(dx);
      }
    }

    function up(e: PointerEvent) {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - x0;
      const dy = Math.abs(e.clientY - y0);
      const should = locked && dx > THRESHOLD && dy < 90;
      pid = null;
      locked = false;
      clearHint();
      if (should) go();
    }

    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [go]);

  const api: BackApi = { go, nested, register };

  return (
    <BackCtx.Provider value={api}>
      {children}
      <div
        ref={hintRef}
        aria-hidden
        className="pointer-events-none fixed top-1/2 left-0 z-50 flex size-11 items-center justify-center rounded-full bg-cream text-navy shadow-panel opacity-0"
        style={{ transform: "translate(-28px, -50%)" }}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M15 6 9 12l6 6" />
        </svg>
      </div>
    </BackCtx.Provider>
  );
}

export function useBackStack(): BackApi {
  const ctx = useContext(BackCtx);
  if (!ctx) throw new Error("useBackStack needs BackStackProvider");
  return ctx;
}

/** Register a nested screen. Browser back, header back, and edge-swipe all close it. */
export function useBackLayer(active: boolean, onClose: () => void) {
  const { register } = useBackStack();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;
    let unreg: (() => void) | undefined;
    const id = window.requestAnimationFrame(() => {
      unreg = register(() => onCloseRef.current());
    });
    return () => {
      window.cancelAnimationFrame(id);
      unreg?.();
    };
  }, [active, register]);
}
