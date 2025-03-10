/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [filter, setFilter] = useState<SortType | string>('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const todoses = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    todoses();
  }, []);

  const closeError = () => {
    setError(null);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  let visibleGoods = [...todos];

  if (filter === SortType.Active) {
    visibleGoods = visibleGoods.filter(good => !good.completed);
  }

  if (filter === SortType.Completed) {
    visibleGoods = visibleGoods.filter(good => good.completed);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {visibleGoods.map(e => (
            <div
              data-cy="Todo"
              key={e.id}
              className={`todo ${e.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={e.completed}
                  disabled={loading}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {e.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(e => !e.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === SortType.All ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() =>
                  setFilter(filter === SortType.All ? '' : SortType.All)
                }
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === SortType.Active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() =>
                  setFilter(filter === SortType.Active ? '' : SortType.Active)
                }
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === SortType.Completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() =>
                  setFilter(
                    filter === SortType.Completed ? '' : SortType.Completed,
                  )
                }
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.filter(todo => todo.completed).length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
