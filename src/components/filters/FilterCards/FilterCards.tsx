import { FilterCard } from "../FilterCard/FilterCard";
import styles from "./FilterCards.module.scss";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

interface FilterCardsProps {
  activeFilter: FilterVariant;
  onChange: (filter: FilterVariant) => void;
  filterCounts: Record<FilterVariant, number>;
}

export function FilterCards({ activeFilter, onChange, filterCounts }: FilterCardsProps) {
  const filters = [
    { label: "Today", count: filterCounts.today, variant: "today" },
    { label: "Overdue", count: filterCounts.overdue, variant: "overdue" },
    { label: "Scheduled", count: filterCounts.scheduled, variant: "scheduled" },
    {
      label: "Unscheduled",
      count: filterCounts.unscheduled,
      variant: "unscheduled",
    },
    { label: "All", count: filterCounts.all, variant: "all" },
    {
      label: "Completed",
      count: filterCounts.completed,
      variant: "completed",
    },
  ] as const;

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
