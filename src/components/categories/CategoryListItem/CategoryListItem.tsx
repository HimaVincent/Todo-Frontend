import styles from "./CategoryListItem.module.scss";
import { EditIcon, DeleteIcon } from "../../../assets/icons";
import { useState } from "react";

interface CategoryListItemProps {
  name: string;
  count: number;
  isActive?: boolean;
  isSystemCategory?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => void;
}

export function CategoryListItem({ name, count, isActive = false, isSystemCategory = false, onClick, onDelete, onRename }: CategoryListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name);

  const trimmed = value.trim();
  const isInvalid = !trimmed;

  const pillClassName = [styles["category-list-item__pill"], isActive && styles["category-list-item__pill--active"]].filter(Boolean).join(" ");

  const handleSave = () => {
    if (isInvalid) {
      return;
    }

    onRename?.(trimmed);
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

          <div className={styles["category-list-item__edit-actions"]}>
            <button
              className={`${styles["category-list-item__button"]} ${styles["category-list-item__button--primary"]}`}
              type="button"
              onClick={handleSave}
              disabled={isInvalid}
            >
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
