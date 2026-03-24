import { CategoryListItem } from "../CategoryListItem/CategoryListItem";
import styles from "./CategoryList.module.scss";

interface Category {
  id: number;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  onDeleteCategory: (category: Category) => void;
  onRenameCategory: (id: number, name: string) => void;
}

export function CategoryList({ categories, activeCategoryId, onCategoryChange, onDeleteCategory, onRenameCategory }: CategoryListProps) {
  return (
    <div className={styles["category-list"]}>
      <CategoryListItem name="All tasks" count={0} isActive={activeCategoryId === null} isSystemCategory onClick={() => onCategoryChange(null)} />

      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          name={category.name}
          count={0}
          isActive={activeCategoryId === category.id}
          onClick={() => onCategoryChange(category.id)}
          onDelete={() => onDeleteCategory(category)}
          onRename={(newName) => onRenameCategory(category.id, newName)}
        />
      ))}
    </div>
  );
}
