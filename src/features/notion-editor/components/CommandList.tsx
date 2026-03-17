import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './CommandList.module.css';

interface CommandItem {
  title: string;
  description?: string;
  command: (props: { editor: any; range: any }) => void;
}

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export const CommandList = forwardRef((props: CommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className={styles.items}>
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`${styles.item} ${index === selectedIndex ? styles.isSelected : ''}`}
            key={index}
            onClick={() => selectItem(index)}
            type="button"
          >
            <div className={styles.itemTitle}>{item.title}</div>
            {item.description ? (
              <div className={styles.itemDescription}>{item.description}</div>
            ) : null}
          </button>
        ))
      ) : (
        <div className={styles.empty}>No result</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';
