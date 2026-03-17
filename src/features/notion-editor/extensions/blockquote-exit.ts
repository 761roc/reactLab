import { Extension } from '@tiptap/core';

export const BlockquoteExit = Extension.create({
  name: 'blockquoteExit',

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state } = this.editor;
        const { selection } = state;

        if (!selection.empty) {
          return false;
        }

        const { $from } = selection;

        if (!this.editor.isActive('blockquote')) {
          return false;
        }

        if ($from.parent.type.name !== 'paragraph') {
          return false;
        }

        if ($from.parent.content.size !== 0) {
          return false;
        }

        return this.editor.commands.unsetBlockquote();
      },
    };
  },
});

