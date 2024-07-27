<template>
  <v-card
    color="white"
    :style="{
      borderLeft: `5px solid ${message.color}`,
      borderRadius: '5px',
      marginBottom: '10px'
    }"
    :class="{ 'ml-auto': isCurrentUser }"
    max-width="80%"
    elevation="2"
  >
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-2">
        <v-chip
          :color="message.color"
          text-color="white"
          size="small"
          class="font-weight-bold"
        >
          <span class="text-caption">{{ message.user }}</span>
        </v-chip>
        <span class="text-caption text-grey">{{ formatTimestamp(message.timestamp) }}</span>
      </div>
      <div 
        style="color: black;"
        v-html="renderMarkdown(message.text)"
      ></div>
    </v-card-text>
  </v-card>
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { format, parseISO } from 'date-fns';

export default {
  name: 'MessageItem',
  props: {
    message: {
      type: Object,
      required: true
    },
    isCurrentUser: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const renderMarkdown = (text) => {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      const rawHtml = marked(text);
      return DOMPurify.sanitize(rawHtml);
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      const date = parseISO(timestamp);
      return format(date, 'HH:mm:ss');
    };

    return {
      renderMarkdown,
      formatTimestamp
    };
  }
};
</script>

<style scoped>
.v-card-text :deep(p) {
  margin-bottom: 0.5em;
}
.v-card-text :deep(p:last-child) {
  margin-bottom: 0;
}
.v-card-text :deep(a) {
  color: inherit;
  text-decoration: underline;
}
.v-card-text :deep(code) {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  padding: 0.2em 0.4em;
}
.v-card-text :deep(pre) {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  padding: 1em;
  overflow-x: auto;
}
.v-card-text :deep(ul), .v-card-text :deep(ol) {
  padding-left: 1.5em;
}
.v-card-text :deep(blockquote) {
  border-left: 3px solid currentColor;
  margin-left: 0;
  padding-left: 1em;
  opacity: 0.8;
}
</style>