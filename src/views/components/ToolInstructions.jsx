import { getToolSeoContent } from '../../lib/seo/toolSeoContent';

const getActionLabel = (toolName) => toolName.toLowerCase().replace(/\bpdf\b/g, 'PDF');

export default function ToolInstructions({ tool }) {
  const action = getActionLabel(tool.name);
  const content = getToolSeoContent(tool);

  return (
    <section className="tool-content-section" aria-labelledby="how-to-title">
      <h2 id="how-to-title">{content.howToTitle}</h2>
      <ol className="instruction-list">
        {content.steps.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {step.features ? (
              <ul>
                {step.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
                <li>Uses a dedicated backend endpoint at {tool.nextEndpoint}.</li>
              </ul>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="subtask-grid" aria-label={`${tool.name} detailed tutorials`}>
        {content.subTasks.map((subTask) => (
          <article key={subTask.title} className="subtask-item">
            <h3>{subTask.title}</h3>
            <p>{subTask.body}</p>
          </article>
        ))}
      </div>

      <section className="workflow-section" aria-labelledby="workflow-title">
        <h3 id="workflow-title">Common {action} workflows</h3>
        <ul>
          {content.workflows.map((workflow) => (
            <li key={workflow}>{workflow}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
