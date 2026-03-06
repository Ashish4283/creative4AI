<?php
require_once 'db-config.php';

$content = [
    "core" => [
        [
            "title" => "Start Trigger",
            "icon" => "Zap",
            "description" => "The foundation of your workflow. \n\nHOW TO CONFIGURE:\n1. Open Settings: Double-click the node.\n2. Choose Type: Select \"Webhook\", \"Manual\", or \"Schedule\".\n3. Webhook URL: Copy the generated URL to external apps.",
            "color" => "text-amber-400",
            "deepDive" => [
                "overview" => "What is a Start Trigger?\nThe Start Trigger is the genesis node of every Horizon Workflow. Without a Start Trigger, a workflow cannot be executed. It defines HOW and WHEN an automation begins. All workflows MUST contain exactly one Start Trigger.",
                "sections" => [
                    [
                        "title" => "Section 1: Trigger Types",
                        "content" => "1. Manual Run: The workflow is triggered by an explicit action from a human user inside the dashboard or via an App UI.\n\n2. Schedule (Cron): The workflow runs automatically based on a time interval (e.g., every 15 minutes, or every Sunday at 3 AM). Best used for report generation, data scraping, or periodic syncs.\n\n3. Webhook (Event-Driven): You receive a unique Webhook URL. Whenever an external service (like Stripe, Shopify, or a custom application) sends a POST request with data to this URL, the workflow instantly activates, capturing the incoming JSON."
                    ],
                    [
                        "title" => "Section 2: Node Configuration",
                        "content" => "Double-click the Start Trigger node on the canvas to open its Inspector panel. Here, you will see:\n\n- Label: You can rename the trigger (e.g., 'Shopify Order Received').\n- Type Selector: Choose between the 3 main types mentioned above.\n- URL / Payload Preview: If Webhook is selected, you can copy the URL and define the expected JSON schema to help autocomplete variables downstream."
                    ],
                    [
                        "title" => "Section 3: Troubleshooting Issues",
                        "content" => "Problem: My Webhook isn't starting the workflow.\nFixes:\n- Ensure the external app is sending a 'POST' request, not a GET request.\n- Check if the JSON payload is properly formatted. Malformed JSON will be rejected by the API Gateway.\n- Verify the workflow is not set to 'Inactive'.\n\nProblem: Manual run says 'Validation Error'.\nFixes:\n- Check if you have left any nodes disconnected. A Start Trigger must have an outbound connection line going to the next logical step."
                    ]
                ]
            ]
        ],
        [
            "title" => "If / Else",
            "icon" => "Activity",
            "description" => "Intelligent decision making based on data conditions.",
            "color" => "text-red-400",
            "deepDive" => [
                "overview" => "What is an If / Else Node?\nThis node allows your workflow to branch into different paths based on incoming data. It acts as the logical crossroad of the process builder.",
                "sections" => [
                    [
                        "title" => "Configuration",
                        "content" => "- Value 1: The input variable to test, usually selected from a previous node (e.g., {{stripe.amount}}).\n- Operator: Standard comparison operators (Equals, Not Equals, Greater Than, Contains, Is Empty).\n- Value 2: The static or dynamic value to compare against (e.g., 1000)."
                    ],
                    [
                        "title" => "Routing Actions",
                        "content" => "If the condition evaluates to TRUE, the token flows out of the Green handle. If FALSE, the token flows out of the Red handle. You must connect distinct downstream nodes to both handles to handle each outcome."
                    ]
                ]
            ]
        ],
        [
            "title" => "Context Memory",
            "icon" => "Shield",
            "description" => "The persistent memory layer of your workflow agent.",
            "color" => "text-amber-500",
            "deepDive" => [
                "overview" => "What is Context Memory?\nA key/value store that persists across workflow executions, allowing your agents to 'remember' data about users or states between separate runs.",
                "sections" => [
                    [
                        "title" => "Storing Data",
                        "content" => "Set operation to 'Store', define a unique Key (like 'user_email_123_history'), and pass the value you wish to remember. The value can be a string or a complex JSON object."
                    ],
                    [
                        "title" => "Reading Data",
                        "content" => "Set operation to 'Read' and input the exact Key used previously. The node will fetch the latest saved context from the vault and output it into the workflow runtime for AI models or logical checks."
                    ]
                ]
            ]
        ]
    ],
        [
            "title" => "Wait / Delay",
            "icon" => "Clock",
            "description" => "Control the timing of your operations.",
            "color" => "text-rose-400",
            "deepDive" => [
                "overview" => "What is a Wait / Delay Node?\nA functional node designed to pause the cognitive thread of an autonomous workflow. This is crucial for rate-limiting, human-in-the-loop dependencies, or naturalized AI cadences.",
                "sections" => [
                    [
                        "title" => "Configuration",
                        "content" => "- Duration: A numerical value representing the time to pause.\n- Unit: Select between Seconds, Minutes, or Hours."
                    ],
                    [
                        "title" => "Common Enterprise Use Cases",
                        "content" => "1. Drip Campaigns: Add a 24-hour Wait node between email sends to simulate human cadences.\n2. Polling: Loop back to an API Request node with a 5-second wait to check if an external task is completed.\n3. Rate Limiting: Prevent 429 Too Many Requests errors when scraping massive databases or triggering OpenAI batches."
                    ]
                ]
            ]
        ],
        [
            "title" => "Merge Paths",
            "icon" => "ArrowRightLeft",
            "description" => "Re-converges multiple branch paths into a single pipeline.",
            "color" => "text-cyan-400",
            "deepDive" => [
                "overview" => "What is a Merge Paths Node?\nWhen workflows branch out via If/Else gates, you often need them to rejoin a primary path (e.g., regardless of whether a customer bought Item A or Item B, they both get the 'Thank You' email). The Merge Path node accomplishes this.",
                "sections" => [
                    [
                        "title" => "Visual Configuration",
                        "content" => "- Connect the outputs of multiple independent nodes into the left-side input handle of this module.\n- ONLY ONE path will execute downstream when triggered, keeping your workflow singular and clean."
                    ]
                ]
            ]
        ],
        [
            "title" => "Data Transformation",
            "icon" => "Database",
            "description" => "Manipulate complex JSON objects and arrays natively.",
            "color" => "text-indigo-500",
            "deepDive" => [
                "overview" => "What is Data Transformation?\nEnterprise logic often involves disparate APIs. Shopify JSON looks different from Stripe JSON. This node allows you to visually map, aggregate, filter, and normalize payloads without writing custom code.",
                "sections" => [
                    [
                        "title" => "Operations Available",
                        "content" => "1. Key Mapping: Rename JSON keys to match downstream system expectations.\n2. Filter Array: Remove elements from lists based on standard logical checks (e.g. Price > 50).\n3. Extract/Aggregate: Pull out a specific column from an array of objects."
                    ]
                ]
            ]
        ]
    ],
    "plugins" => [
        [
            "title" => "AI Model",
            "icon" => "Brain",
            "description" => "Primary generative intelligence block.",
            "color" => "text-purple-500",
            "deepDive" => [
                "overview" => "What is the AI Model Node?\nThe core reasoning engine. It allows you to inject advanced Large Language Models directly into your logical flow. You can use it to infer data, rewrite text, classify sentiment, or generate complex code structures on the fly.",
                "sections" => [
                    [
                        "title" => "Configuration & Prompting",
                        "content" => "- System Prompt: Defines the strict persona and boundaries of the AI (e.g., 'You are a strict data extractor. Return ONLY a valid JSON').\n- User Prompt: The specific task execution command. Use double curly brackets {{...}} to dynamically inject data from previous steps into the final prompt context.\n- Temperature: Set to 0.0 for strict analytical tasks. Set to 0.8+ for creative tasks."
                    ],
                    [
                        "title" => "Troubleshooting Output Layouts",
                        "content" => "Problem: The AI is returning markdown text wrapped in ```json ... ``` blocks, which breaks my downstream logic!\nFix: Explicitly tell the AI in the System prompt: 'Do not use markdown formatting. Output raw JSON ONLY.' Ensure your downstream node checks for trailing/leading characters."
                    ]
                ]
            ]
        ],
        [
            "title" => "API Request (Webhooks)",
            "icon" => "Globe",
            "description" => "Interface with any cloud software.",
            "color" => "text-blue-500",
            "deepDive" => [
                "overview" => "What is the API Request Node?\nThis allows Creative4AI to talk to literally any external system on the internet. It crafts outbound HTTP requests directly from your workflow.",
                "sections" => [
                    [
                        "title" => "Authentication Setup",
                        "content" => "Click into the Headers section. Most SaaS tools use Bearer tokens.\nKey: Authorization\nValue: Bearer YOUR_SUPER_SECRET_TOKEN"
                    ],
                    [
                        "title" => "Payloads (POST / PUT)",
                        "content" => "Switch the Method to POST. Define a JSON payload in the body. You can construct dynamic JSON properties using data variables from earlier nodes, like:\n{\n  'customer_name': '{{trigger.name}}'\n}"
                    ]
                ]
            ]
        ],
        [
            "title" => "User App UI",
            "icon" => "FileCode",
            "description" => "Render interactive forms for humans.",
            "color" => "text-pink-500",
            "deepDive" => [
                "overview" => "What is the User App Node?\nUnlike purely background automation, Horizon Process Builder lets you pause execution to ask a human for input. This node auto-generates a highly aesthetic web-form.",
                "sections" => [
                    [
                        "title" => "Execution Suspension",
                        "content" => "When the workflow reaches this node, it stops completely. An execution task is added to the 'Pending App' queue. Once a human navigates to the App link, fills out the requested fields, and clicks Submit, the workflow resumes with that newly acquired human data."
                    ]
                ]
            ]
        ]
    ]
];

foreach ($content as $sid => $data) {
    $json = json_encode($data);
    $stmt = $pdo->prepare("INSERT INTO knowledge_base (section_id, content_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE content_json = ?");
    $stmt->execute([$sid, $json, $json]);
}

echo "Detailed Knowledge Base sync complete.";
?>
