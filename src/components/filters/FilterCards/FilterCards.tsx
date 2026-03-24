import { FilterCard } from "../FilterCard/FilterCard";
import styles from "./FilterCards.module.scss";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

interface FilterCardsProps {
  activeFilter: FilterVariant;
  onChange: (filter: FilterVariant) => void;
}

const filters = [
  { label: "Today", count: 0, variant: "today" as FilterVariant },
  { label: "Overdue", count: 0, variant: "overdue" as FilterVariant },
  { label: "Scheduled", count: 0, variant: "scheduled" as FilterVariant },
  { label: "Unscheduled", count: 1, variant: "unscheduled" as FilterVariant },
  { label: "All", count: 1, variant: "all" as FilterVariant },
  { label: "Completed", count: 2, variant: "completed" as FilterVariant },
];

export function FilterCards({ activeFilter, onChange }: FilterCardsProps) {
  return (
    <div className={styles["filter-cards"]}>
      {filters.map((filter) => (
        <FilterCard
          key={filter.variant}
          label={filter.label}
          count={filter.count}
          variant={filter.variant}
          isActive={activeFilter === filter.variant}
          onClick={() => onChange(filter.variant)}
        />
      ))}
    </div>
  );
}
