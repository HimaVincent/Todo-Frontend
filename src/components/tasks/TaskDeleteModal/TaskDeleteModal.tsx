import styles from "./TaskDeleteModal.module.scss";

interface TaskDeleteModalProps {
  taskTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function TaskDeleteModal({ taskTitle, onClose, onConfirm }: TaskDeleteModalProps) {
  return (
    <div className={styles["task-delete-modal__overlay"]}>
      <div className={styles["task-delete-modal"]}>
        <div className={styles["task-delete-modal__header"]}>
          <h2 className={styles["task-delete-modal__title"]}>Delete task</h2>
        </div>

        <p className={styles["task-delete-modal__text"]}>
          Delete <strong>"{taskTitle}"</strong>? This action cannot be undone.
        </p>

        <div className={styles["task-delete-modal__actions"]}>
          <button
            className={`${styles["task-delete-modal__button"]} ${styles["task-delete-modal__button--danger"]}`}
            type="button"
            onClick={onConfirm}
          >
            Delete task
          </button>

          <button className={styles["task-delete-modal__button"]} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
