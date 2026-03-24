import styles from "./CompletedTaskList.module.scss";

export function CompletedTaskList() {
  return (
    <section className={styles["completed-task-list"]}>
      <h3 className={styles["completed-task-list__title"]}>Completed tasks (2)</h3>

      <div className={styles["completed-task-list__items"]}>
        <div className={styles["completed-task-list__item"]}>Buy Skye Shoes (copy)</div>
        <div className={styles["completed-task-list__item"]}>Review Java revision notes</div>
      </div>
    </section>
  );
}
