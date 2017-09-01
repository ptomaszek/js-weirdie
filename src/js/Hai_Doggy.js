introAnd(presentAllTheWeirdnesses);

function introAnd(callback) {
    new Typed('#intro', {
        // typeSpeed: 1,
        // strings: ['H'],
        strings: [$('#introText').html()],
        typeSpeed: 7,
        startDelay: 500,
        loop: false,
        showCursor: false,
        onComplete: callback
    });
}


function setUpProveAllTheCasesButton() {
    $('#proveAllCasesWrapper').slideDown();
    $('#proveAllCasesButton').click(function () {
        $(this).attr("disabled", true);
        $('.proveCaseButtonNormal').last().click();
    });
}
function presentAllTheWeirdnesses() {
    setUpProveAllTheCasesButton();
    takeTheCase(1);
    showSavedPuppies();
    initTerminal();
    $('#footer').delay(1500).fadeIn();
}


function itIsOver() {
    $('#proveAllCasesButton').attr("disabled", true);
    refreshSavedPuppiesCount();
}

function takeTheCase(caseNo) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'cases/' + caseNo + '.js');
    xhr.onload = function () {
        if (xhr.status === 404) {
            itIsOver();
            return;
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            showCase(caseNo, xhr.responseText);
        }
    };
    xhr.onerror = function (e) {
        console.error(e);
    };
    xhr.send();
}

function showCase(caseNo, code) {
    var caseId = 'case' + caseNo;
    var $case = $('#caseX').clone().attr('id', caseId);
    $case.find('.caseNo').text(caseNo);
    $case.children('.caseCode').text(code);

    var $proveCaseButton = $case.find('.proveCaseButton');
    $proveCaseButton.click(function () {
        executeWeirdCode(code, $case.children('.caseResult'));
        $(this).attr("disabled", true);
        $case.children('.provedIndicator').css('visibility', 'visible').hide().fadeIn();
        refreshSavedPuppiesCount();
        takeTheCase(caseNo + 1);
    });

    if($('#proveAllCasesButton').attr('disabled')){
        $proveCaseButton.click();
    }

    $('#cases').append($case);
    $case.slideDown('slow');
}

function executeWeirdCode(code, $result) {
    $result.text('');
    var oldConsole = window.console;
    window.console = {
        log: function (str) {
            $result.append((JSON && JSON.stringify ? JSON.stringify(str) : str) + '<br />');
        }
    };
    eval('(function() {' + code + '}())');
    window.console = oldConsole;
}

function initTerminal() {
    $(function ($, undefined) {
        $('#terminal').terminal(function (command) {
            if (command !== '') {
                try {
                    var result = window.eval(command);
                    if (result !== undefined) {
                        this.echo(String(result));
                    }
                } catch (e) {
                    this.error(String(e));
                }
            } else {
                this.echo('');
            }
        }, {
            title: 'JS Terminal (emulator)',
            greetings: 'Will you save another Puppy?',
            name: 'savingPuppy',
            width: 500,
            height: 200
        }).insert('null <= 0');
    });
    $('#terminalWrapper').attr('visibility', 'visible').hide().delay(1000).slideDown('slow');
}


function showSavedPuppies() {
    $('#savedPuppies').show();
}
function refreshSavedPuppiesCount() {
    $('#savedPuppiesCount').text($.find('.proveCaseButtonNormal:disabled').length);
}
