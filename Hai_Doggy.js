presentAllTheWeirdnesses();
refreshSavedPuppiesCount();

function presentAllTheWeirdnesses() {
    thisIsKindaWeird(1);
}

function thisIsKindaWeird(caseNo) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'cases/' + caseNo + '.js');
    xhr.onload = function () {
        if (xhr.status === 404) {
            return;
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            showCase(caseNo, xhr.responseText);
            thisIsKindaWeird(caseNo + 1);

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

    $case.children('.proveCaseButton').click(function () {
        executeWeirdCode(code, $case.children('.caseResult'));
        $(this).attr("disabled", true);
        $case.children('.provedIndicator').show();
        refreshSavedPuppiesCount();
    });

    $('#cases').append($case);
    $case.show();
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

jQuery(function ($, undefined) {
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
        greetings: 'Will you save another Puppy?',
        name: 'savingPuppy',
        width: 500,
        height: 200
    }).insert('null <= 0');
});


function refreshSavedPuppiesCount() {
    $('#savedPuppies').text($('.provedIndicator:visible').length);
}