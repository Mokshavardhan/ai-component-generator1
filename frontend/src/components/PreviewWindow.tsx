// src/components/PreviewWindow.tsx

'use client';



import { useAppStore } from '@/stores/useAppStore';



export default function PreviewWindow() {

const latestCode = useAppStore((state) => state.activeSession?.latestCode);



  const createIframeContent = (jsx: string, css: string) => {

    // This new regex can find "const Name =" OR "function Name..."

    const match = jsx.match(/(?:const|function)\s+([A-Z]\w*)/);

    const componentName = match ? match[1] : null;



    // This removes any import/export lines

    const sanitizedJsx = jsx.split('\n').filter(line =>

      !line.trim().startsWith('import') && !line.trim().startsWith('export')

    ).join('\n');



    return `

      <html>

        <head>

          <style>${css}</style>

        </head>

        <body>

          <div id="root"></div>

          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>

          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

          <script type="text/babel">

            try {

              const renderComponent = () => {

                ${sanitizedJsx}

                if (${!!componentName}) {

                  // This dynamically renders the component we found

                  return React.createElement(${componentName});

                }

                return <div>Component could not be rendered.</div>;

              };

              const root = ReactDOM.createRoot(document.getElementById('root'));

              root.render(renderComponent());

            } catch (e) {

              const rootEl = document.getElementById('root');

              rootEl.innerHTML = '<pre style="color: red;">' + e + '</pre>';

            }

          </script>

        </body>

      </html>

    `;

  };



  return (

    <div className="preview-window">

      <div className="panel-header">Preview</div>

      <div className="preview-content">

        <iframe

          srcDoc={latestCode ? createIframeContent(latestCode.jsx, latestCode.css) : 'about:blank'}

          title="Component Preview"

          sandbox="allow-scripts"

          width="100%"

          height="100%"

        />

      </div>

    </div>

  );

}