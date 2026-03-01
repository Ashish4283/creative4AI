export const MOCK_DRIVE_FILES = [
    { id: '1B2M2Y8Asg', name: 'Q3_Financial_Report.xlsx', type: 'sheet', size: '2.4 MB', rows: 1240 },
    { id: '1x9D7f3Hjk', name: 'Leads_Export_2024.csv', type: 'csv', size: '850 KB', rows: 500 },
    { id: '1p5L9k2Mno', name: 'User_Feedback_Raw.gsheet', type: 'sheet', size: '1.1 MB', rows: 320 },
];

export const MOCK_PREVIEW_ROWS = [
    { id: 1, date: '2024-01-15', customer: 'Acme Corp', amount: '$1,200.00', status: 'Paid' },
    { id: 2, date: '2024-01-16', customer: 'Globex Inc', amount: '$3,450.50', status: 'Pending' },
    { id: 3, date: '2024-01-16', customer: 'Soylent Corp', amount: '$980.00', status: 'Paid' },
];

export const AI_TEMPLATES = {
    custom: 'You are a helpful assistant...',
    enrich: 'Analyze the following data row and enrich it with missing information:\n\n{row_data}',
    summarize: 'Summarize the following content in 3 bullet points:\n\n{content}',
    classify: 'Classify the following text into categories:\n\n{text}'
};

export const TUTORIALS = {
    'first-app': {
        title: 'My First App: The Feedback Reader',
        duration: '10 min',
        steps: [
            {
                title: '1. The Workspace',
                content: 'Hi there! 👋 This is where you build your app. \n\n👈 **Left Side:** Your toolbox. It has all the blocks (we call them "Nodes") you need.\n👉 **Right Side:** The settings panel. This is where you change how blocks work.\n🎨 **Center:** The canvas. This is where you drag and drop blocks to build!'
            },
            {
                title: '2. The Start Button',
                content: 'Every app needs a "Go" button. \n\n1. Find the **Start Trigger** block already on the screen.\n2. Click it once.\n3. Look at the right panel. Make sure "Trigger Type" says **Manual**. \n\nThis means the app waits for you to click "Run".'
            },
            {
                title: '3. Create a Form',
                content: 'We need a place to type something. \n\n1. Look at the Toolbox on the left.\n2. Find **User App** (it\'s pink!).\n3. Drag it onto the center screen.\n\nThis block makes a screen pop up where you can type.'
            },
            {
                title: '4. Connect the Dots',
                content: 'Now, let\'s connect them! \n\n1. Find the little dot on the **right** side of the "Start Trigger".\n2. Click and drag a line to the dot on the **left** side of the "User App".\n\n✨ Zap! They are connected. Power flows from left to right.'
            },
            {
                title: '5. Design Your Form',
                content: 'Let\'s make the form look cool.\n\n1. Click the **User App** block.\n2. In the right panel, change "App Title" to **"My Feedback App"**.\n3. Look for "Form Schema" and click the little **+** button.\n4. Change "Label" to **"What do you think?"**.\n5. Change "Type" to **"Long Text"**.'
            },
            {
                title: '6. Add the Brain (AI)',
                content: 'Let\'s make it smart!\n\n1. Drag an **AI Model** block (purple) from the toolbox.\n2. Connect the **User App** (right dot) to the **AI Model** (left dot).\n3. Click the AI block.\n4. In the settings, change "Task Type" to **Summarize**.\n\nNow the AI will read what you type and make it short!'
            },
            {
                title: '7. The Finish Line',
                content: 'We need to see the answer.\n\n1. Drag an **Export / Save** block (green) to the canvas.\n2. Connect the **AI Model** to it.\n3. Click the Export block. You don\'t need to change anything here for now.'
            },
            {
                title: '8. 🚀 Launch It!',
                content: 'Time to test!\n\n1. Click the green **Run** button at the top right.\n2. A box will appear. Type a long story about your day.\n3. Click Submit.\n4. Watch the blocks light up!\n5. Click the last green block and look at the **Debug** tab on the right to see the AI\'s summary.'
            }
        ]
    },
    'simple-chatbot': {
        title: 'Build a Funny Chatbot',
        duration: '5 min',
        steps: [
            {
                title: '1. Get Ready',
                content: 'Start with a blank canvas (or delete old blocks). You should just have the **Start Trigger**.'
            },
            {
                title: '2. The Chat Box',
                content: 'Drag a **User App** block onto the canvas. Connect it to the Start Trigger.\n\nClick the User App and add a field:\n- Label: **"Say something to the bot"**\n- Type: **Text Input**'
            },
            {
                title: '3. The Robot Brain',
                content: 'Drag an **AI Model** block and connect it to the User App.\n\nClick the AI block:\n- Task Type: **Custom**\n- System Prompt: **"You are a hilarious robot comedian. Answer everything with a joke."**'
            },
            {
                title: '4. See the Joke',
                content: 'Drag an **Export / Save** block and connect it to the end.\n\nClick **Run**, type "Hello", and see what funny thing your bot says in the Debug tab!'
            }
        ]
    },
    'homework-helper': {
        title: 'Homework Helper',
        duration: '8 min',
        steps: [
            {
                title: '1. Setup',
                content: 'Start with **Start Trigger** -> **User App**.'
            },
            {
                title: '2. The Question',
                content: 'In the User App, add a field:\n- Label: **"Paste your homework question"**\n- Type: **Long Text**'
            },
            {
                title: '3. The Teacher',
                content: 'Add an **AI Model** block.\n- Task Type: **Custom**\n- System Prompt: **"You are a kind teacher. Explain the answer to this question simply and clearly for a student."**'
            },
            {
                title: '4. Run It',
                content: 'Connect an **Export** block at the end. Run the app and paste a hard math problem!'
            }
        ]
    },
    'email-responder': {
        title: 'Build an AI Email Responder',
        duration: '5 min',
        steps: [
            {
                title: 'Start with a Trigger',
                content: 'Drag a "Start Trigger" node onto the canvas. Set the Trigger Type to "Email" and configure a subject filter like "Support Request".'
            },
            {
                title: 'Add AI Processing',
                content: 'Connect an "AI Model" node. Select "Classify" to categorize the email intent (e.g., Refund, Technical Issue) or "Custom" to generate a reply.'
            },
            {
                title: 'Define Logic',
                content: 'Use a "Logic Gate" to check the category. If "Refund", route to a specific path. If "Technical", route to another.'
            },
            {
                title: 'Send Response',
                content: 'End the workflow with an "Export / Save" node set to "Email" destination to send the generated reply back to the user.'
            }
        ]
    },
    'approval-app': {
        title: 'Create a Data Approval App',
        duration: '8 min',
        steps: [
            {
                title: 'Define the App Interface',
                content: 'Add a "User App" node. In the configuration, build a form with fields for the data you need to approve (e.g., "Expense Amount", "Reason").'
            },
            {
                title: 'Connect Data Source',
                content: 'You can feed data into the app from a "Google Drive" node (reading a spreadsheet) or let users manually input data.'
            },
            {
                title: 'Add Approval Logic',
                content: 'Add a "Logic Gate" to check if "Expense Amount" > $500. If true, send an email notification to a manager.'
            },
            {
                title: 'Save Decisions',
                content: 'Use a "Google Drive" node to append the approved/rejected status back to a spreadsheet.'
            }
        ]
    },
    'media-converter': {
        title: 'Media Magic Box',
        duration: '5 min',
        steps: [
            {
                title: '1. What are we building?',
                content: 'We are making a magic tool that changes files! Like turning a document into a PDF or a video into music.\n\n**The Plan:** Upload -> Magic Change -> Download.'
            },
            {
                title: '2. The Drop Zone',
                content: 'First, we need a place to put our file and choose the format.\n\n1. Drag a **User App** node (pink) to the center.\n2. Click it to open settings.\n3. Add Field 1:\n   - Label: **"My File"**\n   - Type: **File Upload**\n   - Variable Name: **file**\n4. Add Field 2:\n   - Label: **"Convert To"**\n   - Type: **Dropdown Select**\n   - Variable Name: **target_format**\n   - Options: **pdf, mp3, jpg**'
            },
            {
                title: '3. The Magic Machine',
                content: 'Now for the fun part!\n\n1. Find the **Media Converter** node (it has a video icon) in the System Plugins list.\n2. Drag it onto the canvas.\n3. Connect the **User App** to the **Media Converter**.'
            },
            {
                title: '4. Auto-Magic',
                content: 'The Media Converter is smart!\n\n1. Click the **Media Converter** node.\n2. You can leave "Target Format" as is.\n3. Because you named your dropdown **target_format** in step 2, the converter will automatically use whatever the user picks!'
            },
            {
                title: '5. Finish Line',
                content: 'Let\'s save the result.\n\n1. Drag an **Export / Save** node (green).\n2. Connect the **Media Converter** to it.\n3. Click the green **Run** button to try your magic app!'
            }
        ]
    }
};
