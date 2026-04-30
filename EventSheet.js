const formScreen = document.getElementById('form-screen')
const eventTitle = document.getElementById('event-title')
const eventDescription = document.getElementById('event-description')
const combatBlocks = document.getElementById('combat-blocks')
const addFightBtn = document.getElementById('add-fight-btn')
const previewBtn = document.getElementById('preview-btn')
const eventCreator = document.getElementById('event-creator')
const letterWriter = document.getElementById('letter-writer')
const eventLocation = document.getElementById('event-location')
const previewScreen = document.getElementById('preview-screen')
const briefingContent = document.getElementById('briefing-content')
const backBtn = document.getElementById('back-btn')
const downloadBtn = document.getElementById('download-btn')
const eventStartTime = document.getElementById('event-start-time')
const marchBlocks = document.getElementById('march-blocks')
const addMarchBtn = document.getElementById('add-march-btn')
const viewToggle = document.getElementById('view-toggle')
const cheatsheetContent = document.getElementById('cheatsheet-content')
const briefingWrapper = document.getElementById('briefing-wrapper')
const cheatsheetWrapper = document.getElementById('cheatsheet-wrapper')

addMarchBtn.addEventListener('click', function() {
    var marchBlock = document.createElement('div')
    marchBlock.innerHTML = '<label>From</label><input type="text" class="march-from" placeholder="Starting location">' +
        '<label>To</label><input type="text" class="march-to" placeholder="Destination">' +
        '<label>March Description</label><textarea class="march-desc" placeholder="Describe the march"></textarea>' +
        '<label>Travel mode</label><select class="march-mode"><option value="rp-walk">RP-Walk</option><option value="run">Run</option><option value="run-mounted">Run (Mounted)</option><option value="fly-mounted">Fly (Mounted)</option></select>' +
        '<label>Estimated march time (minutes)</label><input type="number" class="march-time" placeholder="Enter estimated travel time">'
    var removeBtn = document.createElement('button')
    removeBtn.textContent = 'Remove march'
    removeBtn.addEventListener('click', function() {
        marchBlocks.removeChild(marchBlock)
    })
    marchBlock.appendChild(removeBtn)
    marchBlocks.appendChild(marchBlock)
})

const npcBlocks = document.getElementById('npc-blocks')
const addNpcBtn = document.getElementById('add-npc-btn')

addNpcBtn.addEventListener('click', function() {
    var npcBlock = document.createElement('div')
    npcBlock.innerHTML = '<label>NPC Name</label><input type="text" class="npc-name" placeholder="Name of the NPC">' +
        '<label>Description</label><textarea class="npc-desc" placeholder="What is this encounter about?"></textarea>' +
        '<label>Who starts?</label><select class="npc-starter"><option value="npc">NPC</option><option value="user">User</option></select>' +
        '<label>Dialogue</label><textarea class="npc-dialogue" placeholder="Press Enter to switch speakers"></textarea>' +
        '<label>Estimated time (minutes)</label><input type="number" class="npc-time" placeholder="How long will this take?">'

    var npcName = npcBlock.querySelector('.npc-name')
    var starter = npcBlock.querySelector('.npc-starter')
    var dialogue = npcBlock.querySelector('.npc-dialogue')

    function getNextSpeaker(text) {
        var lines = text.split('\n')
        var lastLine = ''
        for (var i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() !== '') {
                lastLine = lines[i]
                break
            }
        }
        if (lastLine === '') {
            return starter.value === 'npc' ? 'npc' : 'user'
        }
        if (lastLine.indexOf('User:') === 0) {
            return 'npc'
        }
        return 'user'
    }

    dialogue.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            var next = getNextSpeaker(dialogue.value)
            var name = npcName.value || 'NPC'
            var prefix = next === 'npc' ? '[' + name + ']: ' : 'User: '
            if (dialogue.value === '') {
                dialogue.value = prefix
            } else {
                dialogue.value = dialogue.value + '\n' + prefix
            }
            calcNpcTime()
        }
    })

    var npcTime = npcBlock.querySelector('.npc-time')
    var manualNpcTime = false

    npcTime.addEventListener('input', function() {
        manualNpcTime = true
    })

    function calcNpcTime() {
        if (manualNpcTime) return
        var lines = dialogue.value.split('\n')
        var count = 0
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== '') count++
        }
        npcTime.value = count > 0 ? count : ''
    }

    dialogue.addEventListener('focus', function() {
        if (dialogue.value === '') {
            var name = npcName.value || 'NPC'
            var prefix = starter.value === 'npc' ? '[' + name + ']: ' : 'User: '
            dialogue.value = prefix
        }
    })

    dialogue.addEventListener('input', calcNpcTime)

    var removeBtn = document.createElement('button')
    removeBtn.textContent = 'Remove NPC'
    removeBtn.addEventListener('click', function() {
        npcBlocks.removeChild(npcBlock)
    })
    npcBlock.appendChild(removeBtn)
    npcBlocks.appendChild(npcBlock)
})

addFightBtn.addEventListener('click', function() {
    const fightBlock = document.createElement('div')
    fightBlock.innerHTML = '<label>Fight Location</label><input type="text" class="fight-location" placeholder="Where does the fight happen?">' +
        '<label>Enemy type</label><input type="text" class="fight-enemies" placeholder="Who are you fighting?">' +
        '<label>Enemy count</label><input type="number" class="fight-enemy-count" placeholder="How many enemies?">' +
        '<label>Enemy HP (each)</label><input type="number" class="fight-enemy-hp" placeholder="HP per enemy">' +
        '<label>Expected attendees</label><input type="number" class="fight-attendees" placeholder="How many players?">' +
        '<div class="fight-estimate-row"><label>Worst case</label><label class="toggle-switch"><input type="checkbox" class="fight-case-toggle"><span class="toggle-slider"></span></label><label>Best case</label></div>' +
        '<label>Estimated fight time (minutes)</label><input type="number" class="fight-time" placeholder="Auto-calculates or type manually">' +
        '<label>Enemy Description</label><textarea class="fight-enemy-desc" placeholder="Describe the enemies"></textarea>' +
        '<label>Fight Result</label><textarea class="fight-result" placeholder="What should the outcome be?"></textarea>'
    var enemyCount = fightBlock.querySelector('.fight-enemy-count')
    var enemyHp = fightBlock.querySelector('.fight-enemy-hp')
    var attendees = fightBlock.querySelector('.fight-attendees')
    var fightTime = fightBlock.querySelector('.fight-time')
    var caseToggle = fightBlock.querySelector('.fight-case-toggle')
    var manualTime = false

    fightTime.addEventListener('input', function() {
        manualTime = true
    })

    function calcFightTime() {
        if (manualTime) return
        var count = Number(enemyCount.value)
        var hp = Number(enemyHp.value)
        var players = Number(attendees.value)
        if (count > 0 && hp > 0 && players > 0) {
            var totalHp = count * hp
            var bestCase = caseToggle.checked
            var dmgPerTurn = bestCase ? (players * 1.3) : 4
            var turns = Math.ceil(totalHp / dmgPerTurn)
            var turnTime = 2 + (0.5 * players)
            var minutes = Math.round(turns * turnTime)
            fightTime.value = minutes
        }
    }

    enemyCount.addEventListener('input', calcFightTime)
    enemyHp.addEventListener('input', calcFightTime)
    attendees.addEventListener('input', calcFightTime)
    caseToggle.addEventListener('change', calcFightTime)

    const removeBtn = document.createElement('button')
    removeBtn.textContent = 'Remove fight'
    removeBtn.addEventListener('click', function() {
        combatBlocks.removeChild(fightBlock)
    })
    fightBlock.appendChild(removeBtn)
    combatBlocks.appendChild(fightBlock)

})

function addMinutesToTime(timeStr, minutes) {
    var match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!match) return ''
    var hours = parseInt(match[1])
    var mins = parseInt(match[2])
    var period = match[3].toUpperCase()
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    var totalMins = hours * 60 + mins + minutes
    var endHours = Math.floor(totalMins / 60) % 24
    var endMins = totalMins % 60
    var endPeriod = endHours >= 12 ? 'PM' : 'AM'
    if (endHours > 12) endHours -= 12
    if (endHours === 0) endHours = 12
    return endHours + ':' + (endMins < 10 ? '0' : '') + endMins + ' ' + endPeriod
}

function formatDuration(minutes) {
    var hours = Math.floor(minutes / 60)
    var mins = minutes % 60
    if (hours > 0 && mins > 0) return hours + 'h ' + mins + 'min'
    if (hours > 0) return hours + 'h'
    return mins + 'min'
}

previewBtn.addEventListener('click', function() {
    var title = eventTitle.value
    var creator = eventCreator.value
    var location = eventLocation.value
    var writer = letterWriter.value
    var description = eventDescription.value
    var startTime = eventStartTime.value.trim()
    var totalMinutes = 0
    var marchMinutes = 0
    var npcMinutes = 0
    var fightMinutes = 0

    var fights = combatBlocks.children
    var fightHTML = ''
    for (var i = 0; i < fights.length; i++) {
        var fight = fights[i]
        var fightLocation = fight.querySelector('.fight-location').value
        var fightEnemies = fight.querySelector('.fight-enemies').value
        var fightEnemyCount = fight.querySelector('.fight-enemy-count').value
        var fightEnemyDesc = fight.querySelector('.fight-enemy-desc').value
        var fightResult = fight.querySelector('.fight-result').value
        var fightTime = Number(fight.querySelector('.fight-time').value) || 0
        fightMinutes += fightTime
        fightHTML = fightHTML + '<h3>Fight ' + (i + 1) + '</h3>' +
        '<p>Location: ' + fightLocation + '</p>' +
        '<p>Enemies: ' + fightEnemies + '</p>' +
        '<p>Count: ' + fightEnemyCount + '</p>' +
        '<p>Description: ' + fightEnemyDesc + '</p>' +
        '<p>Result: ' + fightResult + '</p>' +
        '<p>Estimated fight time: ' + formatDuration(fightTime) + '</p>'
    }

    var marches = marchBlocks.children
    var marchHTML = ''
    for (var i = 0; i < marches.length; i++) {
        var march = marches[i]
        var marchFrom = march.querySelector('.march-from').value
        var marchTo = march.querySelector('.march-to').value
        var marchDesc = march.querySelector('.march-desc').value
        var marchMode = march.querySelector('.march-mode').value
        var marchTime = Number(march.querySelector('.march-time').value) || 0
        marchMinutes += marchTime
        marchHTML = marchHTML + '<h3>March ' + (i + 1) + '</h3>' +
        '<p>From: ' + marchFrom + '</p>' +
        '<p>To: ' + marchTo + '</p>' +
        '<p>Description: ' + marchDesc + '</p>' +
        '<p>Travel mode: ' + marchMode + '</p>' +
        '<p>Estimated march time: ' + formatDuration(marchTime) + '</p>'
    }

    var npcs = npcBlocks.children
    var npcHTML = ''
    for (var i = 0; i < npcs.length; i++) {
        var npc = npcs[i]
        var npcName = npc.querySelector('.npc-name').value
        var npcDesc = npc.querySelector('.npc-desc').value
        var npcDialogue = npc.querySelector('.npc-dialogue').value
        var npcTime = Number(npc.querySelector('.npc-time').value) || 0
        npcMinutes += npcTime
        npcHTML = npcHTML + '<h3>NPC: ' + npcName + '</h3>' +
        '<p>Description: ' + npcDesc + '</p>' +
        '<p>Dialogue:</p><pre>' + npcDialogue + '</pre>' +
        '<p>Estimated NPC time: ' + formatDuration(npcTime) + '</p>'
    }

    totalMinutes = marchMinutes + npcMinutes + fightMinutes

    var writerHTML = ''
    if (writer !== '') {
        writerHTML = '<p>Written by: ' + writer + '</p>'
    }

    var timeHTML = ''
    if (totalMinutes > 0 || startTime !== '') {
        timeHTML = '<h3>Estimated Time</h3>'
        if (totalMinutes > 0) {
            timeHTML += '<p>Duration: ' + formatDuration(totalMinutes) + '</p>'
        }
        if (startTime !== '' && totalMinutes > 0) {
            var endTime = addMinutesToTime(startTime, totalMinutes)
            if (endTime !== '') {
                timeHTML += '<p>Start: ' + startTime + '</p>'
                timeHTML += '<p>Estimated end: ' + endTime + '</p>'
            }
        } else if (startTime !== '') {
            timeHTML += '<p>Start: ' + startTime + '</p>'
        }
    }

    briefingContent.innerHTML = '<h1>' + title + '</h1>' +
    '<p>Location: ' + location + '</p>' +
    '<p>' + description + '</p>' +
    '<p>Created by: ' + creator + '</p>' +
    writerHTML +
    timeHTML

    var cheatsheetTimeHTML = '<h3>Time Breakdown</h3>'
    if (marchMinutes > 0) {
        cheatsheetTimeHTML += '<p>Total march time: ' + formatDuration(marchMinutes) + '</p>'
    }
    if (npcMinutes > 0) {
        cheatsheetTimeHTML += '<p>Total NPC time: ' + formatDuration(npcMinutes) + '</p>'
    }
    if (fightMinutes > 0) {
        cheatsheetTimeHTML += '<p>Total fight time: ' + formatDuration(fightMinutes) + '</p>'
    }
    if (totalMinutes > 0) {
        cheatsheetTimeHTML += '<p>Total event duration: ' + formatDuration(totalMinutes) + '</p>'
    }
    if (startTime !== '' && totalMinutes > 0) {
        var endTime = addMinutesToTime(startTime, totalMinutes)
        if (endTime !== '') {
            cheatsheetTimeHTML += '<p>Start: ' + startTime + ' — Estimated end: ' + endTime + '</p>'
        }
    }

    cheatsheetContent.innerHTML = '<h1>' + title + ' — Cheatsheet</h1>' +
    marchHTML +
    npcHTML +
    fightHTML +
    '<p>Created by: ' + creator + '</p>' +
    writerHTML +
    cheatsheetTimeHTML

    formScreen.hidden = true
    previewScreen.hidden = false
})
backBtn.addEventListener('click', function(){
    previewScreen.hidden = true
    formScreen.hidden = false
})
downloadBtn.addEventListener('click', function() {
    var target
    var filename
    if (viewToggle.checked) {
        target = cheatsheetWrapper
        filename = eventTitle.value + '_cheatsheet.jpg'
    } else {
        target = briefingWrapper
        filename = eventTitle.value + '.jpg'
    }
    document.fonts.ready.then(function() {
        return domtoimage.toJpeg(target)
    }).then(function(dataUrl) {
        var link = document.createElement('a')
        link.href = dataUrl
        link.download = filename
        link.click()
    })
})
viewToggle.addEventListener('change', function() {
    if (viewToggle.checked) {
        briefingWrapper.hidden = true
        cheatsheetWrapper.hidden = false
    } else {
        briefingWrapper.hidden = false
        cheatsheetWrapper.hidden = true
    }
})