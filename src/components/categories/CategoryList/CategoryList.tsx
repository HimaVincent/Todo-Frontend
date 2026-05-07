import { CategoryListItem } from "../CategoryListItem/CategoryListItem";
import styles from "./CategoryList.module.scss";

interface Category {
  id: number;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: number | "uncategorised" | null;
  onCategoryChange: (id: number | "uncategorised" | null) => void;
  onDeleteCategory: (category: Category) => void;
  onRenameCategory: (id: number, name: string) => void;
  allTasksCount: number;
  uncategorisedTasksCount: number;
  getCategoryTaskCount: (categoryId: number) => number;
}

export function CategoryList({
  categories,
  activeCategoryId,
  onCategoryChange,
  onDeleteCategory,
  onRenameCategory,
  allTasksCount,
  uncategorisedTasksCount,
  getCategoryTaskCount,
}: CategoryListProps) {
  return (
    <div className={styles["category-list"]}>
      <CategoryListItem
        name="All tasks"
        count={allTasksCount}
        isActive={activeCategoryId === null}
        isSystemCategory
        onClick={() => onCategoryChange(null)}
      />

      <CategoryListItem
        name="Uncategorised"
        count={uncategorisedTasksCount}
        isActive={activeCategoryId === "uncategorised"}
        isSystemCategory
        onClick={() => onCategoryChange("uncategorised")}
      />

      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          name={category.name}
          count={getCategoryTaskCount(category.id)}
          isActive={activeCategoryId === category.id}
          categories={categories}
          onClick={() => onCategoryChange(category.id)}
          onDelete={() => onDeleteCategory(category)}
          onRename={(newName) => onRenameCategory(category.id, newName)}
        />
      ))}
    </div>
  );
}
