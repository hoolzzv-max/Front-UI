import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

type TooltipState = {
  open: boolean;
  content: ReactNode;
  placement: TooltipPlacement;
  x: number;
  y: number;
};

type ShowTooltipOptions = {
  placement?: TooltipPlacement;
  delay?: number;
};

type TooltipContextValue = {
  showTooltip: (
    content: ReactNode,
    rect: DOMRect,
    options?: ShowTooltipOptions,
  ) => void;
  hideTooltip: () => void;
};

type TooltipProviderProps = {
  children: ReactNode;
};

type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

const DEFAULT_TOOLTIP_DELAY = 350;
const TOOLTIP_OFFSET = 10;

function getTooltipPosition(rect: DOMRect, placement: TooltipPlacement) {
  switch (placement) {
    case "right":
      return {
        x: rect.right + TOOLTIP_OFFSET,
        y: rect.top + rect.height / 2,
      };

    case "bottom":
      return {
        x: rect.left + rect.width / 2,
        y: rect.bottom + TOOLTIP_OFFSET,
      };

    case "left":
      return {
        x: rect.left - TOOLTIP_OFFSET,
        y: rect.top + rect.height / 2,
      };

    case "top":
    default:
      return {
        x: rect.left + rect.width / 2,
        y: rect.top - TOOLTIP_OFFSET,
      };
  }
}

function getTooltipStyle(state: TooltipState): CSSProperties {
  const base: CSSProperties = {
    position: "fixed",
    left: state.x,
    top: state.y,
    zIndex: 80,
    pointerEvents: "none",
  };

  switch (state.placement) {
    case "right":
      return {
        ...base,
        transform: "translateY(-50%)",
      };

    case "bottom":
      return {
        ...base,
        transform: "translateX(-50%)",
      };

    case "left":
      return {
        ...base,
        transform: "translate(-100%, -50%)",
      };

    case "top":
    default:
      return {
        ...base,
        transform: "translate(-50%, -100%)",
      };
  }
}

function composeEventHandlers<EventType>(
  userHandler: ((event: EventType) => void) | undefined,
  internalHandler: (event: EventType) => void,
) {
  return (event: EventType) => {
    userHandler?.(event);
    internalHandler(event);
  };
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  const timerRef = useRef<number | null>(null);

  const [state, setState] = useState<TooltipState>({
    open: false,
    content: null,
    placement: "top",
    x: 0,
    y: 0,
  });

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const hideTooltip = useCallback(() => {
    clearTimer();

    setState((currentState) => ({
      ...currentState,
      open: false,
    }));
  }, [clearTimer]);

  const showTooltip = useCallback(
    (
      content: ReactNode,
      rect: DOMRect,
      options: ShowTooltipOptions = {},
    ) => {
      clearTimer();

      const placement = options.placement ?? "top";
      const delay = options.delay ?? DEFAULT_TOOLTIP_DELAY;
      const position = getTooltipPosition(rect, placement);

      timerRef.current = window.setTimeout(() => {
        setState({
          open: true,
          content,
          placement,
          x: position.x,
          y: position.y,
        });
      }, delay);
    },
    [clearTimer],
  );

  const value = useMemo<TooltipContextValue>(
    () => ({
      showTooltip,
      hideTooltip,
    }),
    [showTooltip, hideTooltip],
  );

  return (
    <TooltipContext.Provider value={value}>
      {children}

      {state.open && (
        <div
          role="tooltip"
          style={getTooltipStyle(state)}
          className="max-w-xs rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-100 shadow-xl"
        >
          {state.content}
        </div>
      )}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error("useTooltip must be used inside TooltipProvider.");
  }

  return context;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = DEFAULT_TOOLTIP_DELAY,
  disabled = false,
}: TooltipProps) {
  const { showTooltip, hideTooltip } = useTooltip();
  const triggerRef = useRef<HTMLElement | null>(null);

  if (!isValidElement(children)) {
    throw new Error("Tooltip expects a single valid React element as a child.");
  }

  const child = Children.only(children) as ReactElement<
    HTMLAttributes<HTMLElement> & {
      ref?: React.Ref<HTMLElement>;
    }
  >;

  const openTooltip = () => {
    if (disabled || !triggerRef.current) return;

    showTooltip(content, triggerRef.current.getBoundingClientRect(), {
      placement,
      delay,
    });
  };

  const closeTooltip = () => {
    hideTooltip();
  };

  const setRef = (node: HTMLElement | null) => {
    triggerRef.current = node;

    const childRef = (child as { ref?: React.Ref<HTMLElement> | null }).ref;

    if (typeof childRef === "function") {
      childRef(node);
    } else if (childRef && typeof childRef === "object" && "current" in childRef) {
      (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return cloneElement(child, {
    ref: setRef,
    onPointerEnter: composeEventHandlers(
      child.props.onPointerEnter,
      openTooltip,
    ),
    onPointerLeave: composeEventHandlers(
      child.props.onPointerLeave,
      closeTooltip,
    ),
    onFocus: composeEventHandlers(child.props.onFocus, openTooltip),
    onBlur: composeEventHandlers(child.props.onBlur, closeTooltip),
  });
}
