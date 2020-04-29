/**
 * Chrome extensions get null value, while lit-html expects it to be either an object or undefined.
 * If you import anything that depends on the below line, you need to move it to a separate import, as imports are
 * executed before other code.
 */
delete window.customElements;
