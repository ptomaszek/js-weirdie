introAnd(presentAllTheWeirdnesses);

function introAnd(callback) {
    new Typed('#intro', {
        // strings: ['H'],
        strings: [$('#introText').html()],
        typeSpeed: 18,
        startDelay: 500,
        loop: false,
        showCursor: false,
        onComplete: callback
    });
}


function setUpProveAllTheWeirdnessesButton() {
    $('#proveAllWeirdnessesWrapper').slideDown();
    $('#proveAllWeirdnessesButton').click(function () {
        $(this).attr("disabled", true);
        $('.proveWeirdnessButtonNormal').last().click();
    });
}
function presentAllTheWeirdnesses() {
    setUpProveAllTheWeirdnessesButton();
    takeTheWeirdness(1);
    showSavedPuppies();
    initTerminal();
}


function itIsOver() {
    $('#proveAllWeirdnessesButton').attr("disabled", true);
    refreshSavedPuppiesCount();

    new Typed('#caseClosed', {
        strings: [$('#caseClosedText').html()],
        backSpeed: 100,
        typeSpeed: 18,
        startDelay: 1500,
        loop: false,
        showCursor: false,
        onTypingPaused: function(){
                scrollToBottom();
        },
        onComplete: function () {
            $('#footer').delay(500).fadeIn(800);
            scrollToBottom();
        }
    });
}

function takeTheWeirdness(weirdnessNo) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'weirdnesses/' + weirdnessNo + '.js');
    xhr.onload = function () {
        if (xhr.status === 404) {
            itIsOver();
            return;
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            showWeirdness(weirdnessNo, xhr.responseText);
        }
    };
    xhr.onerror = function (e) {
        console.error(e);
    };
    xhr.send();
}

function scrollToBottom() {
    $('html, body').animate({scrollTop: $(document).height()}, 900);
}
function showWeirdness(weirdnessNo, code) {
    var weirdnessId = 'weirdness' + weirdnessNo;
    var $weirdness = $('#weirdnessX').clone().attr('id', weirdnessId);
    $weirdness.find('.weirdnessNo').text(weirdnessNo);
    $weirdness.children('.weirdnessCode').text(code);

    var $proveWeirdnessButton = $weirdness.find('.proveWeirdnessButtonNormal');
    $proveWeirdnessButton.click(function () {
        executeWeirdCode(code, $weirdness.children('.weirdnessResult'));
        $(this).attr("disabled", true);
        $weirdness.children('.provedIndicator').css('visibility', 'visible').hide().fadeIn();
        refreshSavedPuppiesCount();
        takeTheWeirdness(weirdnessNo + 1);
    });

    if ($('#proveAllWeirdnessesButton').attr('disabled')) {
        $proveWeirdnessButton.click();
    }

    $('#weirdnesses').append($weirdness);
    $weirdness.slideDown('slow');

    scrollToBottom();
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
    $('.savedPuppiesCount').text($.find('.proveWeirdnessButtonNormal:disabled').length);
}
