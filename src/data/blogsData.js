export const blogsData = [
  {
    id: 'sap-labs-inside-track-2026',
    title: "Visit to SAP Labs India for Project Expo 'Inside Track'",
    date: "30th May 2026",
    subtitle: "Evaluating AI Applications in Enterprise Production Systems: What I learnt at SAP Labs, Bengaluru!",
    content: [
      {
        type: 'paragraph',
        text: "On 30 May 2026, I attended SAP Inside Track Bengaluru, a community-driven event where practitioners share what they are building and learning around the SAP ecosystem. There were 11 tracks running in parallel, and I had the opportunity to explore two of them. I chose these two because they sit close to what I care about most: building AI systems that people can actually trust."
      },
      {
        type: 'paragraph',
        text: "As I sat through both, I realised they were asking the same question from two different angles. How do you trust an AI system enough to put it into production?"
      },
      {
        type: 'image',
        src: '/art_1.png',
        alt: 'SAP Labs Inside Track Bengaluru Expo',
        caption: 'SAP Inside Track Bengaluru - Project Expo'
      },
      {
        type: 'heading',
        level: 2,
        text: 'Track 1: LLM Security and Benchmarking'
      },
      {
        type: 'paragraph',
        text: "The first session was presented by Vimal Dubey and Ahona Bhattacharyya from SAP Labs. AI security is my main area of interest, so I went in with high expectations, and they finished the session with much, much more than I had hoped for."
      },
      {
        type: 'paragraph',
        text: "The session started with a point that is easy to overlook. As generative AI gets integrated into enterprise applications, evaluating an LLM only on accuracy is no longer sufficient. When a model powers business-critical workflows and customer-facing solutions, the risks look very different: hallucinations, jailbreak vulnerabilities, toxic outputs, unsafe responses and unreliable behaviour under adversarial prompts. A model can score well on accuracy and still fail badly on any of these, and in an enterprise setting even one such failure can damage customer trust."
      },
      {
        type: 'paragraph',
        text: "To address this, they presented a benchmarking framework built to evaluate and monitor LLMs hosted on enterprise AI platforms such as SAP AI Core. It covers six benchmarks, all using open-source datasets: TruthfulQA, ToxiGen, BeaverTails, HaluEval, JailBreakBench and ToxiChat. Each one tests a different dimension of safety and reliability, so together they give a much fuller picture of how a model behaves than any single score could. What I liked here was that the framework gives teams continuous visibility into model behaviour, instead of a one-time check before launch."
      },
      {
        type: 'paragraph',
        text: "Another idea I found fascinating was AI judging AI, where models are used to evaluate the outputs of other models. When you are testing at enterprise scale, manual review simply cannot keep up, so this approach makes continuous evaluation practical. It also raised interesting questions about how much we can trust the judge itself, which is a discussion I really enjoyed being part of."
      },
      {
        type: 'paragraph',
        text: "They also demonstrated an interactive dashboard that supports model comparison, robustness ranking, provider analysis and risk assessment. Seeing the benchmarks turned into something a developer could actually use to compare models and make decisions made the whole session feel practical and not just theoretical."
      },
      {
        type: 'paragraph',
        text: "My biggest takeaway was that evaluation cannot be a one-time activity. A model that passes today can start performing worse tomorrow, so continuous evaluation, adversarial testing and comparison across models are what allow teams to catch problems early and make deployment decisions based on evidence. For agents being deployed at scale in organisations like SAP, this is not optional. It is what responsible and ethical deployment looks like."
      },
      {
        type: 'heading',
        level: 2,
        text: 'Track 2: AI Quality Engineering for Banking'
      },
      {
        type: 'paragraph',
        text: "The second session was presented by Jawahar Govindaraj from Tritusa, and it approached the same problem from the testing side. He explained how AI Quality Engineering (QE) builds automated frameworks to test, validate and audit complex AI systems, using an automated lending pipeline as the running example."
      },
      {
        type: 'paragraph',
        text: "Think about what such a pipeline does. It processes sensitive financial documents, often through Retrieval-Augmented Generation (RAG), and then passes the results to scoring algorithms that influence real lending decisions. If any stage goes wrong, the consequences land on real people, whether that is a wrongly rejected applicant or a risky loan that should never have been approved. AI QE exists to make sure the whole system remains accurate, compliant and accountable, and it does this by validating every stage:"
      },
      {
        type: 'list',
        items: [
          "User intake and guardrails: checking the entry portal against bad data injection and making sure submitted files follow strict formatting rules.",
          "RAG parsing and extraction: auditing that financial data is pulled accurately from unstructured documents without any hallucination.",
          "Underwriting and grading: testing the credit scoring model against historical edge cases so that risk assessment stays stable.",
          "Automated compliance checks: confirming that the decision logic follows regional regulations, such as Fair Lending laws, before any approval is finalised."
        ]
      },
      {
        type: 'paragraph',
        text: "What stayed with me most was his point that this is not only a fintech concern. Banks, other enterprises and any organisation running AI on high-stakes decisions in their workflows need the same discipline. The domain changes, but the need for testing, validation and auditability stays the same."
      },
      {
        type: 'heading',
        level: 2,
        text: 'Putting the two together'
      },
      {
        type: 'paragraph',
        text: "Looking at both sessions side by side, they complement each other very well. The first showed me how to measure whether a model is safe and reliable. The second showed how to build that measurement into an entire pipeline, so that it keeps working long after deployment. Both made the same point: evaluation is not something you do at the end of a project, it is part of the architecture from the start."
      },
      {
        type: 'paragraph',
        text: "As more companies move from experimenting with AI to depending on it, this kind of thinking will matter more and more. Building a capable model is only half the job. Proving that it is safe, accurate and accountable is the other half."
      },
      {
        type: 'paragraph',
        text: "I left with a clearer sense of where AI security and quality engineering meet, and with far more than I expected when I walked in. A big thank you to Vimal Dubey and Ahona Bhattacharyya for being so interactive and for welcoming my perspectives during the session."
      }
    ]
  },
  {
    id: 'fission-genai-security-springer-2026',
    title: "My research experience in Gen AI Security and a Springer LNNS Publication",
    date: "6th November 2026",
    subtitle: "FISSION: What Happens When an untrusted Image Triggers a Tool Call in an agent?",
    content: [
      {
        type: 'paragraph',
        text: "This year, as part of the research cohort at PES University’s Centre for Computer Networks and Cyber Security (CCNCS), I worked on one question that I couldn’t shake: if a vision-language model reads an image, and that model is connected to tools, what stops the image from deciding what the system does next?"
      },
      {
        type: 'paragraph',
        text: "That question became FISSION, a framework for evaluating cross-modal prompt injection in tool-calling vision-language multi-agent systems. The paper has been accepted at ICICC 2027 and will be published in Springer LNNS. In this post I want to walk through how I thought about the problem, what we built, and what I took away from it."
      },
      {
        type: 'image',
        src: '/art_2.png',
        alt: 'FISSION: Cross-Modal Prompt Injection in Tool-Calling Vision-Language Multi-Agent Systems',
        caption: 'FISSION Framework Architecture'
      },
      {
        type: 'heading',
        level: 2,
        text: 'The problem'
      },
      {
        type: 'paragraph',
        text: "Vision-language models (VLMs) are increasingly used as the perception layer of agent pipelines. They look at a document, a screenshot or a form, and pass what they understood to agents that act on it. Those agents call tools through protocols like the Model Context Protocol (MCP): querying databases, sending messages, summarising documents."
      },
      {
        type: 'paragraph',
        text: "When I traced this setup end to end, I noticed a path that I couldn’t find measured anywhere:"
      },
      {
        type: 'callout',
        text: "pixels → vision encoder → language decoder → structured tool call → dispatch"
      },
      {
        type: 'paragraph',
        text: "Every stage in that chain has been studied on its own. Their composition has not. An untrusted image enters at one end, and a tool action leaves at the other."
      },
      {
        type: 'heading',
        level: 2,
        text: 'What I found when I read the literature'
      },
      {
        type: 'paragraph',
        text: "Most of what I read fell into two camps."
      },
      {
        type: 'paragraph',
        text: "The first is agent security benchmarks, such as InjecAgent, AgentDojo and MCPTox. They show that indirect prompt injection can push an agent into unauthorized tool calls. But the injection channel is text: a poisoned tool response, a malicious tool description. The perception layer of a multimodal agent is outside their scope by design."
      },
      {
        type: 'paragraph',
        text: "The second is multimodal attack research: adversarial perturbations, backdoored encoders, instructions hidden in images. This work shows that images can steer what a VLM reports. But it measures the model’s output, such as a caption, a label or a detection score. It stops before asking whether the change propagates into an action."
      },
      {
        type: 'paragraph',
        text: "So there was a gap between “the image changed what the model said” and “the image changed what the system did.” That gap is what FISSION is built around."
      },
      {
        type: 'heading',
        level: 2,
        text: 'Where the motivation came from'
      },
      {
        type: 'paragraph',
        text: "A big part of this came from attending SAP Inside Track Bengaluru. I sat in on a session on LLM security and benchmarking, where models were evaluated well beyond accuracy before being deployed at enterprise scale. The takeaway for me was that evaluation and assurance are a prerequisite for deploying agents at scale, not an afterthought."
      },
      {
        type: 'paragraph',
        text: "What struck me was how much of that tooling assumes text. If agents are going to see, then the evaluation has to cover what they see. I couldn’t find that for images, so we decided to build it."
      },
      {
        type: 'heading',
        level: 2,
        text: 'What FISSION is'
      },
      {
        type: 'paragraph',
        text: "FISSION has two parts."
      },
      {
        type: 'heading',
        level: 3,
        text: '1. A layered threat taxonomy'
      },
      {
        type: 'paragraph',
        text: "We organise the attack surface into seven injection surfaces across three attack timings."
      },
      {
        type: 'list',
        items: [
          "Pre-deployment: a backdoor planted in the model before it ever reaches the pipeline.",
          "Inference time: four layers that follow an image through the model. These are the image plane, cross-modal fusion, language decoding and tool-call construction.",
          "Post-execution: propagation, which we split into two separate modes."
        ]
      },
      {
        type: 'paragraph',
        text: "That last split is something I care about. In agent infection, an agent’s own prompt or state gets modified. In shared-context poisoning, no agent is modified, and only the shared buffer that agents read from gets contaminated. These look similar from the outside but need different fixes. You can recover from the first by resetting the agent. The second survives agent restarts, and you have to clear the shared state itself. Treating them as one thing hides that difference, so the taxonomy keeps them apart."
      },
      {
        type: 'heading',
        level: 3,
        text: '2. An executable testbed'
      },
      {
        type: 'paragraph',
        text: "The taxonomy isn’t just on paper. Each layer is implemented as an attack module with its own metrics, running as containerized services on a message bus. The setup includes an orchestrator that plans and signs tool calls, an executor that validates and dispatches them, a shared context store, and a honeypot agent that observes without executing anything."
      },
      {
        type: 'paragraph',
        text: "The testbed also supports model backends as a configuration choice, so the same pipeline can be pointed at different VLMs."
      },
      {
        type: 'paragraph',
        text: "On the attack side, the served model doesn’t expose gradients, so image perturbations are generated against a surrogate and then fed through the live pipeline. That keeps the setup realistic: the attacker doesn’t need access to the deployed model’s internals."
      },
      {
        type: 'heading',
        level: 2,
        text: 'Defenses, and where they sit'
      },
      {
        type: 'paragraph',
        text: "We instrument five defense layers, and an important detail is where each one sits. Two of them gate the tool-call path and can refuse a call before it runs. The other three observe: an offline scanner that checks a model for backdoors before deployment, an encoder-level probe, and the honeypot agent."
      },
      {
        type: 'paragraph',
        text: "The two that gate dispatch are deliberately different:"
      },
      {
        type: 'list',
        items: [
          "A structural verifier checks that a call is well-formed, authorised for the agent’s role, and untampered with, using a signature bound to the task.",
          "A semantic guard checks whether the call actually makes sense for what the user asked."
        ]
      },
      {
        type: 'paragraph',
        text: "I like this pairing because of one idea: a signature proves integrity, not benignity. A tool call can be perfectly formed and correctly signed, and still express an intent the user never had. The structural check can’t see that, and the semantic check can. The order matters too, since semantic verification runs first and can reject a call that is structurally impeccable. Having both, with failures logged at each stage, makes it observable where a pipeline broke instead of just that it broke."
      },
      {
        type: 'heading',
        level: 2,
        text: 'What I learned'
      },
      {
        type: 'paragraph',
        text: "I’m keeping the specific numbers for the paper, but a few things stayed with me."
      },
      {
        type: 'paragraph',
        text: "First, the way we usually report adversarial robustness doesn’t transfer cleanly to agent-level attacks. The standard convention is to sweep a perturbation budget and plot success against it. In our setting that turned out to be a less informative way to look at the problem than I expected, and I think it affects how this kind of work should be evaluated and reported. I’ll say more once the paper is out."
      },
      {
        type: 'paragraph',
        text: "Second, defenses should sit where the action happens. Checking at the point of dispatch gives you a clearer signal than checking earlier in the pipeline, where many harmless variations look like attacks."
      },
      {
        type: 'paragraph',
        text: "Third, measuring honestly matters more than measuring impressively. A lot of the work went into being clear about what each number does and does not mean."
      }
    ]
  }
];
