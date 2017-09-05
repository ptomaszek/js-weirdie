intro();

function intro() {
    var afterIntro = function () {
        $('#skipIntroButton').slideUp();
        setTimeout(function () {
            presentAllTheWeirdnesses();
        }, 1000);
    };


    var typed = new Typed('#intro', {
        strings: [$('#introText').html()],
        typeSpeed: 18,
        startDelay: 500,
        loop: false,
        showCursor: false,
        onComplete: afterIntro
    });

    $('#skipIntroButton').fadeIn('slow')
        .click(function () {
            typed.destroy();

            var introText = $('#introText').html().replace('`', '');
            introText.match(/\^\w+/g).forEach(function (stopper) {
                introText = introText.replace(stopper, '');
            });

            $('#intro').html(introText);
            afterIntro();
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
        typeSpeed: 3,
        startDelay: 800,
        loop: false,
        showCursor: false,
        onTypingPaused: function () {
            scrollToBottom();
        },
        onComplete: function () {
            $('#footer').delay(300).fadeIn(200);
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

function produceWeirdnessResult(weirdnessNo, actualOutput, $summaryElement) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'weirdnesses/' + weirdnessNo + '_expectedOutput.log');
    xhr.onload = function () {
        var weirdnessSummaryText;
        var expectedOutputOneLiner = xhr.responseText.replace(/(\r\n|\n|\r)/gm, "");

        if (xhr.readyState === 4 && xhr.status === 200 && expectedOutputOneLiner === actualOutput) {
            $summaryElement.addClass('weirdnessConfirmed');
            weirdnessSummaryText = $('#weirdnessSummaryTextOk').text();
            refreshSavedPuppiesCount();
        } else {
            weirdnessSummaryText = $('#weirdnessSummaryTextFail').text();
            console.error('Weirdness no.: ' + weirdnessNo + '. Expected output: ' + expectedOutputOneLiner);
        }

        $summaryElement.css('visibility', 'visible').hide().text(weirdnessSummaryText).fadeIn();
    };
    xhr.onerror = function (e) {
        console.error(e);
    };
    xhr.send();
}

function scrollToBottom() {
    $('html, body').animate({scrollTop: $(document).height()}, 100);
}
function showWeirdness(weirdnessNo, code) {
    var weirdnessId = 'weirdness' + weirdnessNo;
    var $weirdness = $('#weirdnessX').clone().attr('id', weirdnessId);
    $weirdness.find('.weirdnessNo').text(weirdnessNo);
    $weirdness.children('.weirdnessCode').text(code);

    var $proveWeirdnessButton = $weirdness.find('.proveWeirdnessButtonNormal');
    $proveWeirdnessButton.click(function () {
        var $result = $weirdness.children('.weirdnessResult');
        executeWeirdCode(code, $result);
        $(this).attr("disabled", true);
        produceWeirdnessResult(weirdnessNo, $result.text(), $weirdness.find('.weirdnessSummary'));
        takeTheWeirdness(weirdnessNo + 1);
    });

    if ($('#proveAllWeirdnessesButton').attr('disabled')) {
        $proveWeirdnessButton.click();
    }

    $('#weirdnesses').append($weirdness);
    $weirdness.slideDown('slow', scrollToBottom);
}

function executeWeirdCode(code, $result) {
    $result.text('');
    var oldConsole = window.console;
    window.console = {
        log: function (str) {
            $result.append((JSON && JSON.stringify ? JSON.stringify(str) : str) + '<br/ >');
        }
    };
    new Function(code)();
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
    $('.savedPuppiesCount').text($.find('.weirdnessConfirmed').length);
}
