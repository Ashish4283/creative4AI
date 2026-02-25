function sendBirthdayNotifications() {
  var birthdaySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Birthday');
  var quoteSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Quote');
  
  var birthdayData = birthdaySheet.getDataRange().getValues();
  var quoteData = quoteSheet.getDataRange().getValues();
  
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM-dd");
  Logger.log("📆 Today's date: " + today);
  
  var slackToken = PropertiesService.getScriptProperties().getProperty('slackToken');
  //var channelId = 'C066YV9AWDQ'; // ✅ Your test or production Slack channel ID
  var channelId = 'C05TZS1KS8N'; // Productoin Channel
  for (var i = 1; i < birthdayData.length; i++) {
    var email = birthdayData[i][0]; // Column A: Email
    var dob = birthdayData[i][1];   // Column B: DOB

    // Skip blank rows
    if (!email || !dob) {
      Logger.log(`⚠️ Row ${i + 1} skipped — missing email or DOB.`);
      continue;
    }

    // Normalize DOB — convert from string if needed
    var parsedDOB;
    if (dob instanceof Date) {
      parsedDOB = dob;
    } else if (typeof dob === "string") {
      parsedDOB = new Date(dob);
      if (isNaN(parsedDOB)) {
        Logger.log(`⚠️ Skipping row ${i + 1} (${email}) — invalid DOB string: ${dob}`);
        continue;
      }
    } else {
      Logger.log(`⚠️ Skipping row ${i + 1} (${email}) — unsupported DOB type`);
      continue;
    }

    var dobFormatted = Utilities.formatDate(parsedDOB, Session.getScriptTimeZone(), "MM-dd");
    Logger.log(`🧾 Row ${i + 1}: ${email} | DOB: ${dobFormatted}`);

    if (dobFormatted === today) {
      Logger.log(`🎯 Birthday today for: ${email}`);
      var slackUserId = getSlackUserIdByEmail(email, slackToken);

      if (slackUserId) {
        var quote = getRandomQuote(quoteData);
        var message = `🎈 H A P P Y - B I R T H D A Y ! 🎈 <@${slackUserId}>!!! 🎉\n"${quote.text}" — ${quote.author}`;
        sendSlackMessage(slackToken, message, channelId);
        Logger.log(`✅ Sent birthday message to ${email}`);
      } else {
        Logger.log(`❌ Could not find Slack ID for: ${email}`);
      }
    }
  }
}

function getSlackUserIdByEmail(email, slackToken) {
  var url = `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(email)}`;
  
  var options = {
    "method": "get",
    "headers": {
      "Authorization": `Bearer ${slackToken}`
    }
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var result = JSON.parse(response.getContentText());

  if (result.ok) {
    return result.user.id;
  } else {
    Logger.log(`Slack API error for ${email}: ${result.error}`);
    return null;
  }
}

function getRandomQuote(quoteData) {
  var quotes = quoteData.slice(1); // skip header
  if (quotes.length === 0) {
    return { text: "Wishing you a day full of happiness and joy!", author: "Birthday Bot" };
  }

  var randomIndex = Math.floor(Math.random() * quotes.length);
  return {
    text: quotes[randomIndex][0],
    author: quotes[randomIndex][1]
  };
}

function sendSlackMessage(slackToken, message, channelId) {
  var url = 'https://slack.com/api/chat.postMessage';

  var payload = {
    "channel": channelId,
    "text": message
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + slackToken
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseCode = response.getResponseCode();

  if (responseCode !== 200) {
    Logger.log("⚠️ Slack POST failed: " + responseCode + " - " + response.getContentText());
    throw new Error("Failed to send Slack message.");
  }

  Logger.log("📨 Slack response: " + response.getContentText());
}

function resetTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendBirthdayNotifications') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('sendBirthdayNotifications')
    .timeBased()
    .atHour(7)  // Set desired hour
    .everyDays(1)
    .inTimezone(Session.getScriptTimeZone())
    .create();
}

function sendBelatedBirthdayNotifications() {
  var birthdaySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Birthday');
  var quoteSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Quote');

  var birthdayData = birthdaySheet.getDataRange().getValues();
  var quoteData = quoteSheet.getDataRange().getValues();

  var slackToken = PropertiesService.getScriptProperties().getProperty('slackToken');
 // var channelId = 'C066YV9AWDQ'; // Use your Slack channel ID
  var channelId = 'C05TZS1KS8N'; // Productoin Channel

  // Get yesterday's date in MM-dd format
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayFormatted = Utilities.formatDate(yesterday, Session.getScriptTimeZone(), "MM-dd");
  Logger.log("📆 Belated check for DOB: " + yesterdayFormatted);

  for (var i = 1; i < birthdayData.length; i++) {
    var email = birthdayData[i][0];
    var dob = birthdayData[i][1];

    if (!email || !dob) continue;

    // Normalize DOB
    var parsedDOB;
    if (dob instanceof Date) {
      parsedDOB = dob;
    } else if (typeof dob === "string") {
      parsedDOB = new Date(dob);
      if (isNaN(parsedDOB)) continue;
    } else {
      continue;
    }

    var dobFormatted = Utilities.formatDate(parsedDOB, Session.getScriptTimeZone(), "MM-dd");

    if (dobFormatted === yesterdayFormatted) {
      Logger.log(`🎯 Belated birthday match for: ${email}`);
      var slackUserId = getSlackUserIdByEmail(email, slackToken);

      if (slackUserId) {
        var quote = getRandomQuote(quoteData);
        var message = `🙏 B E L A T E D - B I R T H D A Y - W I S H E S ! 🎂 <@${slackUserId}>!!! 🥳\n"${quote.text}" — ${quote.author}`;
        sendSlackMessage(slackToken, message, channelId);
        Logger.log(`✅ Sent belated message to ${email}`);
      } else {
        Logger.log(`❌ Could not find Slack ID for: ${email}`);
      }
    }
  }
}

