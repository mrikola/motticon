import { ButtonGroup, ToggleButton, Col } from "react-bootstrap";

type ViewModeToggleProps<T extends string> = {
  viewMode: T;
  setViewMode: (mode: T) => void;
  options: Array<{ value: T; label: string }>;
  className?: string;
};

/**
 * Reusable component for toggling between view modes
 * Used in FinalStandings and DraftPods components
 */
function ViewModeToggle<T extends string>({
  viewMode,
  setViewMode,
  options,
  className,
}: ViewModeToggleProps<T>) {
  return (
    <Col xs={12} className={className}>
      <ButtonGroup className="w-100">
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            id={`toggle-${option.value}`}
            type="radio"
            variant="outline-primary"
            name="view-mode"
            value={option.value}
            checked={viewMode === option.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setViewMode(e.currentTarget.value as T)
            }
            className="flex-fill"
          >
            {option.label}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </Col>
  );
}

export default ViewModeToggle;

