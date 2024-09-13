let htmlEditor = CodeMirror.fromTextArea(document.getElementById('html'), {
    mode: 'xml',
    theme: 'material-darker',
    lineNumbers: true,
    autoCloseTags: true,
  });
  
  let cssEditor = CodeMirror.fromTextArea(document.getElementById('css'), {
    mode: 'css',
    theme: 'material-darker',
    lineNumbers: true,
    autoCloseBrackets: true,
  });
  
  let jsEditor = CodeMirror.fromTextArea(document.getElementById('js'), {
    mode: 'javascript',
    theme: 'material-darker',
    lineNumbers: true,
    autoCloseBrackets: true,
  });
  
  function openTab(tab) {
    const editors = { html: htmlEditor, css: cssEditor, js: jsEditor };
  
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelectorAll('.CodeMirror').forEach(editor => editor.style.display = 'none');
  
    document.querySelector(`.tab-button[onclick="openTab('${tab}')"]`).classList.add('active');
    editors[tab].getWrapperElement().style.display = 'block';
    
    editors[tab].refresh();
  }

  htmlEditor.on('change', updateOutput);
  cssEditor.on('change', updateOutput);
  jsEditor.on('change', updateOutput);
  
  function updateOutput() {
    try {
      const htmlCode = htmlEditor.getValue();
      const cssCode = `<style>${cssEditor.getValue()}</style>`;
      const jsCode = `<script>${jsEditor.getValue()}<\/script>`;
      
      const output = document.getElementById('output').contentWindow.document;
      
      output.open();
      output.write(htmlCode + cssCode + jsCode);
      output.close();
    } catch (e) {
      displayError("an error occurred in the script");
    }
  }

  function displayError(message) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    notification.className = 'notification';
    notification.innerHTML = `<i class="fa-solid fa-exclamation-circle"></i>${message}<button onclick="this.parentElement.remove()">×</button>`;
    
    const bar = document.createElement('div');
    bar.className = 'notification-bar';
    const barInner = document.createElement('div');
    barInner.className = 'notification-bar-inner';
    bar.appendChild(barInner);
    
    notification.appendChild(bar);
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
      barInner.style.width = '0%';
    }, 100);

    setTimeout(() => {
      notification.remove();
    }, 10000);
  }

  document.getElementById('save-all').addEventListener('click', () => {
    if (htmlEditor.getValue().trim() === "" || cssEditor.getValue().trim() === "" || jsEditor.getValue().trim() === "") {
      displayError("all files must contain more than one line");
      return;
    }
  
    saveFile(htmlEditor.getValue(), `savaiuapepula${htmlEditor.getValue().split('\n').length}.html`);
    saveFile(cssEditor.getValue(), `savaiuapepula${cssEditor.getValue().split('\n').length}.css`);
    saveFile(jsEditor.getValue(), `savaiuapepula${jsEditor.getValue().split('\n').length}.js`);
  });
  
  document.getElementById('save-line').addEventListener('click', () => {
    const currentTab = document.querySelector('.tab-button.active').getAttribute('onclick').match(/'(\w+)'/)[1];
    const editor = { html: htmlEditor, css: cssEditor, js: jsEditor }[currentTab];
    
    if (editor.getValue().trim() === "") {
      displayError("add a few more lines");
      return;
    }
  
    saveFile(editor.getValue(), `console${editor.getValue().split('\n').length}.${currentTab}`);
  });

  function saveFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
  
