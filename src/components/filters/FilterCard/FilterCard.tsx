import styles from "./FilterCard.module.scss";

interface FilterCardProps {
  label: string;
  count: number;
  isActive?: boolean;
  variant?: "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";
  onClick?: () => void;
}

export function FilterCard({ label, count, variant = "today", isActive = false, onClick }: FilterCardProps) {
  const className = [styles["filter-card"], styles[`filter-card--${variant}`], isActive && styles["filter-card--active"]].filter(Boolean).join(" ");

  return (
    <button className={className} type="button" onClick={onClick}>
      <span className={styles["filter-card__label"]}>{label}</span>
      <span className={styles["filter-card__count"]}>{count}</span>
    </button>
  );
}
