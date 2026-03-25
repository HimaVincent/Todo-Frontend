import { useEffect, useState } from "react";
import styles from "./CategoryListItem.module.scss";
import { EditIcon, DeleteIcon } from "../../../assets/icons";

interface Category {
  id: number;
  name: string;
}

interface CategoryListItemProps {
  name: string;
  count: number;
  isActive?: boolean;
  isSystemCategory?: boolean;
  categories?: Category[];
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => void;
}

export function CategoryListItem({
  name,
  count,
  isActive = false,
  isSystemCategory = false,
  categories = [],
  onClick,
  onDelete,
  onRename,
}: CategoryListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  useEffect(() => {
    setValue(name);
  }, [name]);

  const trimmedValue = value.trim();
  const normalisedValue = trimmedValue.toLowerCase();
  const normalisedName = name.trim().toLowerCase();

  const isEmpty = !trimmedValue;
  const isUnchanged = normalisedValue === normalisedName;

  const categoryAlreadyExists = categories.some(
    (category) => category.name.toLowerCase() === normalisedValue && category.name.toLowerCase() !== normalisedName,
  );

  const isSaveDisabled = isEmpty || isUnchanged || categoryAlreadyExists;

  const pillClassName = [styles["category-list-item__pill"], isActive && styles["category-list-item__pill--active"]].filter(Boolean).join(" ");

  const buttonClassName = [
    styles["category-list-item__button"],
    styles["category-list-item__button--primary"],
    isSaveDisabled && styles["category-list-item__button--disabled"],
  ]
    .filter(Boolean)
    .join(" ");

  const handleSave = () => {
    if (isSaveDisabled) {
      return;
    }

    onRename?.(trimmedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(name);
    setIsEditing(false);
  };

  return (
    <div className={styles["category-list-item"]}>
      {isEditing ? (
        <div className={styles["category-list-item__edit"]}>
          <input
            className={styles["category-list-item__input"]}
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSave();
              }

              if (event.key === "Escape") {
                handleCancel();
              }
            }}
          />

          {categoryAlreadyExists ? <p className={styles["category-list-item__error"]}>Category already exists</p> : null}

          <div className={styles["category-list-item__edit-actions"]}>
            <button className={buttonClassName} type="button" onClick={handleSave} disabled={isSaveDisabled}>
              Save
            </button>

            <button
              className={`${styles["category-list-item__button"]} ${styles["category-list-item__button--secondary"]}`}
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button className={pillClassName} type="button" onClick={onClick}>
            <span className={styles["category-list-item__name"]}>{name}</span>
            <span className={styles["category-list-item__count"]}>{count}</span>
          </button>

          {!isSystemCategory ? (
            <div className={styles["category-list-item__actions"]}>
              <button
                className={`${styles["category-list-item__icon-button"]} ${styles["category-list-item__icon-button--edit"]}`}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setValue(name);
                  setIsEditing(true);
                }}
              >
                <EditIcon />
              </button>

              <button
                className={`${styles["category-list-item__icon-button"]} ${styles["category-list-item__icon-button--delete"]}`}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.();
                }}
              >
                <DeleteIcon />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
