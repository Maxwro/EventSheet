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

addFightBtn.addEventListener('click', function() {
    const fightBlock = document.createElement('div')
    fightBlock.innerHTML = '<label>Fight Location</label><input type="text" class="fight-location" placeholder="Where does the fight happen?">' +
        '<label>Enemy type</label><input type="text" class="fight-enemies" placeholder="Who are you fighting?">' +
        '<label>Enemy count</label><input type="text" class="fight-enemy-count" placeholder="How many enemies?">' +
        '<label>Enemy Description</label><textarea class="fight-enemy-desc" placeholder="Describe the enemies"></textarea>' +
        '<label>Fight Result</label><textarea class="fight-result" placeholder="What should the outcome be?"></textarea>'
    const removeBtn = document.createElement('button')
    removeBtn.textContent = 'Remove fight'
    removeBtn.addEventListener('click', function() {
        combatBlocks.removeChild(fightBlock)
    })
    fightBlock.appendChild(removeBtn)
    combatBlocks.appendChild(fightBlock)

})

previewBtn.addEventListener('click', function() {
    const title = eventTitle.value
    const creator = eventCreator.value
    const location = eventLocation.value
    const writer = letterWriter.value
    const description = eventDescription.value
    const fights = combatBlocks.children
    var fightHTML = ''
    for (var i = 0; i < fights.length; i++) {
        var fight = fights[i]
        var fightLocation = fight.querySelector('.fight-location').value
        var fightEnemies = fight.querySelector('.fight-enemies').value
        var fightEnemyCount = fight.querySelector('.fight-enemy-count').value
        var fightEnemyDesc = fight.querySelector('.fight-enemy-desc').value
        var fightResult = fight.querySelector('.fight-result').value
        fightHTML = fightHTML + '<h3>Fight ' + (i + 1) + '</h3>' +
        '<p>Location: ' + fightLocation + '</p>' +
        '<p>Enemies: ' + fightEnemies + '</p>' +
        '<p>Count: ' + fightEnemyCount + '</p>' +
        '<p>Description: ' + fightEnemyDesc + '</p>' +
        '<p>Result: ' + fightResult + '</p>'
    }
    var writerHTML = ''
    if (writer !== '') {
        writerHTML = '<p>Written by: ' + writer + '</p>'
    }

    briefingContent.innerHTML = '<h1>' + title + '</h1>' +
    '<p>Location: ' + location + '</p>' +
    '<p>' + description + '</p>' +
    fightHTML +
    '<p>Created by: ' + creator + '</p>' +
    writerHTML
    formScreen.hidden = true
    previewScreen.hidden = false
})
backBtn.addEventListener('click', function(){
    previewScreen.hidden = true
    formScreen.hidden = false
})
downloadBtn.addEventListener('click', function() {
    var wrapper = document.getElementById('briefing-wrapper')
    domtoimage.toJpeg(wrapper).then(function(dataUrl) {
        var link = document.createElement('a')
        link.href = dataUrl
        link.download = eventTitle.value + '.jpg'
        link.click()
    })
})