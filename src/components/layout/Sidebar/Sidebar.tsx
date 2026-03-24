import { useState } from "react";
import { FilterCards } from "../../filters/FilterCards/FilterCards";
import { CategorySearch } from "../../categories/CategorySearch/CategorySearch";
import { CategoryList } from "../../categories/CategoryList/CategoryList";
import styles from "./Sidebar.module.scss";

type FilterVariant = "today" | "overdue" | "scheduled" | "unscheduled" | "all" | "completed";

interface Category {
  id: number;
  name: string;
}

interface SidebarProps {
  activeFilter: FilterVariant;
  onChange: (filter: FilterVariant) => void;
  categories: Category[];
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (category: Category) => void;
  onRenameCategory: (id: number, name: string) => void;
}

export function Sidebar({
  activeFilter,
  onChange,
  categories,
  activeCategoryId,
  onCategoryChange,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
}: SidebarProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const trimmedCategoryName = newCategoryName.trim();

  const categoryAlreadyExists = categories.some((category) => category.name.toLowerCase() === trimmedCategoryName.toLowerCase());

  const isSaveDisabled = !trimmedCategoryName || categoryAlreadyExists;

  const handleSaveCategory = () => {
    if (isSaveDisabled) {
      return;
    }

    onAddCategory(trimmedCategoryName);
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const handleCancelCategory = () => {
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const saveButtonClassName = [
    styles["sidebar__add-category-button"],
    styles["sidebar__add-category-button--primary"],
    isSaveDisabled && styles["sidebar__add-category-button--disabled"],
  ]
    .filter(Boolean)
    .join(" ");

  const cancelButtonClassName = [styles["sidebar__add-category-button"], styles["sidebar__add-category-button--secondary"]].filter(Boolean).join(" ");

  return (
    <aside className={styles["sidebar"]}>
      <div className={styles["sidebar__brand"]}>
        <div className={styles["sidebar__logo"]}>✓</div>
        <h1 className={styles["sidebar__title"]}>To-Do App</h1>
      </div>

      <FilterCards activeFilter={activeFilter} onChange={onChange} />

      <div className={styles["sidebar__search"]}>
        <CategorySearch />
      </div>

      <section className={styles["sidebar__categories-section"]}>
        <div className={styles["sidebar__categories-header"]}>
          <h2 className={styles["sidebar__categories-title"]}>Categories</h2>

          {!isAddingCategory ? (
            <button className={styles["sidebar__add-button"]} type="button" onClick={() => setIsAddingCategory(true)}>
              + Add
            </button>
          ) : null}
        </div>

        {isAddingCategory ? (
          <div className={styles["sidebar__add-category"]}>
            <input
              className={styles["sidebar__add-category-input"]}
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="New category"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSaveCategory();
                }

                if (event.key === "Escape") {
                  handleCancelCategory();
                }
              }}
            />

            {categoryAlreadyExists ? <p className={styles["sidebar__add-category-error"]}>Category already exists</p> : null}

            <div className={styles["sidebar__add-category-actions"]}>
              <button className={saveButtonClassName} type="button" onClick={handleSaveCategory} disabled={isSaveDisabled}>
                Save
              </button>

              <button className={cancelButtonClassName} type="button" onClick={handleCancelCategory}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        <CategoryList
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={onCategoryChange}
          onDeleteCategory={onDeleteCategory}
          onRenameCategory={onRenameCategory}
        />
      </section>
    </aside>
  );
}
