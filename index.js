// =========================
// TOAST NOTIFICATION (replaces alert)
// =========================

(function injectToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #toast {
            position: fixed;
            left: 50%;
            bottom: 28px;
            transform: translate(-50%, 20px);
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: calc(100vw - 32px);
            padding: 12px 18px;
            border-radius: 999px;
            background: rgba(30, 30, 34, 0.96);
            color: #fff;
            font: 500 14px/1.2 system-ui, -apple-system, 'Segoe UI', sans-serif;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease, transform 0.25s ease;
            z-index: 10000;
        }
        #toast.toast--show {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        #toast .toast__icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
        }
        #toast.toast--success .toast__icon { background: #22c55e; }
        #toast.toast--error .toast__icon { background: #ef4444; }
    `;
    document.head.appendChild(style);
})();

let toastTimer;

function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML = '<span class="toast__icon"></span><span class="toast__text"></span>';
        document.body.appendChild(toast);
    }

    toast.classList.remove('toast--success', 'toast--error');
    toast.classList.add(`toast--${type}`);
    toast.querySelector('.toast__icon').textContent = type === 'success' ? '✓' : '!';
    toast.querySelector('.toast__text').textContent = message;
    toast.classList.add('toast--show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('toast--show'), 2200);
}


const container = document.querySelector('.quiz_container')
const button = document.getElementById('disclaimer')
const disContent = document.querySelector('.disclaimer')
const copy = document.getElementById("copy")

const developer = document.querySelector('.develop')
const choseHeader = document.querySelector('.instruction')
button.addEventListener('click' , ()=>{
    disContent.classList.add('conoff')
    console.log('clicked')
})

const menuIcon = document.getElementById('fa-bars')
const navbar = document.getElementById('navbar')
menuIcon.addEventListener('click' , (e)=>{
            console.log('clicked')
            navbar.classList.toggle('active')
        })


const headerLinks = navbar.querySelectorAll('a');

headerLinks.forEach(headerlink => {
    headerlink.addEventListener('click', () => {
        const location = headerlink.getAttribute('href');

        window.location.href = `index.html${location}`;

        navbar.classList.remove('active');
    });
});


const partsNav = document.querySelector('.parts-nav');

partsNav.addEventListener('click', event => {

    const button = event.target.closest('[data-part]');

    if (!button) return;

    const part = button.dataset.part;

    // Find the corresponding section
    const section = document.getElementById(part);

    if (!section) return;

    // Scroll to the section
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    // Update active button
    partsNav.querySelectorAll('[data-part]').forEach(btn => {
        btn.classList.remove('active');
    });

    button.classList.add('active');

});





button.addEventListener('click', () => {
    disContent.classList.add('conoff');
});


developer.addEventListener('click', () => {
    navigator.clipboard.writeText(copy.textContent)
        .then(() => showToast('Copied to clipboard'))
        .catch(() => showToast('Could not copy', 'error'));
});




container.addEventListener('click', (event) => {

    const keys = event.target.closest('.keys');

    if (!keys) return;

    const quiz = keys.closest('.mini.container');

    const explanation = quiz.querySelector('.explanation p');

    const down = keys.querySelector('.fa-chevron-down');
    const up = keys.querySelector('.fa-chevron-up');
    if(down.classList.contains('hide')){
        explanation.style.display = 'none'
    } if(up.classList.contains('hide')){
 explanation.style.display = 'block'
    }
    explanation.classList.toggle('hide');
    down.classList.toggle('hide');
    up.classList.toggle('hide');

});

container.addEventListener('click', (event) => {
    const copyElement = event.target.closest('.copy');

    if (!copyElement) return;

    const quiz = copyElement.closest('.mini');

    if (!quiz) return;

    const question = quiz.querySelector('.quiz p').textContent;

    const options = [...quiz.querySelectorAll('.options p')]
        .map(option => option.textContent);

    const textToCopy = `${question}\n${options.join('\n')}`;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            showToast('Copied to clipboard');
        })
        .catch(() => {
            showToast('Could not copy', 'error');
        });
});


const params = new URLSearchParams(window.location.search);

const examFile = params.get('exam');
const blank_answer_container = document.querySelector('.blank_space')
const short_answer_container = document.querySelector('.question')
async function examget(url) {
    const request = await fetch(url)
    if (!request.ok) throw new Error(`Could not load ${url} (${request.status})`)
    const data = await request.json()
    return data
}

if (!examFile) {

    console.log('no exam is selected');

} else {

    examget(examFile).then(async data => {

        if (data.question_papers) {

            const partsNav = document.querySelector('.parts-nav');

            data.question_papers.forEach((Data, index) => {

                // =========================
                // CREATE NAVIGATION BUTTON
                // =========================

                const button = document.createElement('button');

                button.dataset.part = `part${index + 1}`;
                button.textContent = `Part ${index + 1}`;

                partsNav.appendChild(button);


                // =========================
                // CREATE SECTION
                // =========================

                const sectionByParts = document.createElement('section');

                sectionByParts.id = `part${index + 1}`;

                container.appendChild(sectionByParts);


                // =========================
                // PART I
                // =========================

                if (Data.part_i) {

                    const partOne = Data.part_i;

                    sectionByParts.insertAdjacentHTML(
                        'beforeend',
                        `<h3 class="instruction">${partOne.instructions || ''}</h3>`
                    );

                    partOne.questions?.forEach(element => {

                        const answer = element.answer;

                        const optionsHtml = element.options?.map(
                            option => `<p>${option}</p>`
                        ) || [];

                        const questionHtml = `
                            <div class="mini">

                                <div class="quiz">
                                    <p>${element.number} - ${element.text}</p>
                                </div>

                                <div class="options">
                                    ${optionsHtml.join('')}
                                </div>

                                <div class="copy">
                                    <i class="fa-regular fa-copy"></i>
                                </div>

                                <div class="answer" style="display:none;">
                                    <p>Answer: ${answer ?? ''}</p>
                                </div>

                                <div class="explanation" style="display:none;">
                                    <p>${element.explanation || ''}</p>
                                </div>

                                <p class="collapse" style="display:none;">
                                    See less ↑
                                </p>

                            </div>
                        `;

                        sectionByParts.insertAdjacentHTML(
                            'beforeend',
                            questionHtml
                        );

                        const currentQuestion = sectionByParts.lastElementChild;

                        const explanationDiv =
                            currentQuestion.querySelector('.explanation');

                        const answerDiv =
                            currentQuestion.querySelector('.answer');

                        const collapseEl =
                            currentQuestion.querySelector('.collapse');

                        const options =
                            currentQuestion.querySelectorAll('.options p');

                        options.forEach(option => {

                            option.addEventListener('click', () => {

                                options.forEach(opt => {
                                    opt.classList.remove('correct', 'wrong');
                                });

                                const selectedAnswer =
                                    option.textContent.trim().charAt(0);

                                if (selectedAnswer === answer ||
                                    option.textContent.trim() === answer) {
                                    option.classList.add('correct');
                                } else {
                                    option.classList.add('wrong');
                                }

                                explanationDiv.style.display = 'block';
                                answerDiv.style.display = 'block';
                                collapseEl.style.display = 'inline-block';

                            });

                        });

                        collapseEl.addEventListener('click', () => {

                            explanationDiv.style.display = 'none';
                            answerDiv.style.display = 'none';
                            collapseEl.style.display = 'none';

                        });

                    });

                }


                // =========================
                // PART II
                // =========================

                if (Data.part_ii) {

                    const partTwo = Data.part_ii;

                    sectionByParts.insertAdjacentHTML(
                        'beforeend',
                        `<h3 class="instruction_part_two">
                            ${partTwo.instructions || 'no content'}
                        </h3>`
                    );

                    if (partTwo.questions) {

                        partTwo.questions.forEach(ele => {

                            const blankasnwerHtml =
                                (Array.isArray(ele.answer)
                                    ? ele.answer
                                    : ele.answer != null
                                        ? [ele.answer]
                                        : []
                                ).map(answer => {
                                    return `<p class="answer_p">${answer}</p>`;
                                });

                            const blank_html = `
                                <div class="question">

                                    <p>${ele.number}) ${ele.text}</p>

                                    <div class="copy">
                                        <i class="fa-regular fa-copy"></i>
                                    </div>

                                    <button class="blank_answer_btn">
                                        Answer
                                    </button>

                                    <div class="answer" style="display:none;">

                                        ${blankasnwerHtml.join('')}

                                        <p class="explanation">
                                            ${ele.explanation || ''}
                                        </p>

                                        <p class="collapse">
                                            See less ↑
                                        </p>

                                    </div>

                                </div>
                            `;

                            sectionByParts.insertAdjacentHTML(
                                'beforeend',
                                blank_html
                            );

                        });

                    }

                }


                // =========================
                // PART III
                // =========================

                if (Data.part_iii) {

                    const partThree = Data.part_iii;

                    sectionByParts.insertAdjacentHTML(
                        'beforeend',
                        `<h3 class="instruction_three">
                            ${partThree.instructions || ''}
                        </h3>`
                    );

                    let shortquestionHtml = '';

                    const addAnswer = (item) => {

                        if (!item || (!item.answer && !item.explanation)) {
                            return '';
                        }

                        return `
                            <div class="answer_wrapper">

                                <button class="blank_answer_btn">
                                    Answer
                                </button>

                                <div class="answer_content" hidden>

                                    ${item.answer ? `
                                        <p><strong>Answer:</strong> ${item.answer}</p>
                                    ` : ''}

                                    ${item.explanation ? `
                                        <p><strong>Explanation:</strong> ${item.explanation}</p>
                                    ` : ''}

                                    <button class="collapse">
                                        See less ↑
                                    </button>

                                </div>

                                <div class="copy">
                                    <i class="fa-regular fa-copy"></i>
                                </div>

                            </div>
                        `;
                    };


                    partThree.questions?.forEach(element => {

                        shortquestionHtml += `
                            <div class="question_item">

                                <p>
                                    <strong>
                                        ${element.number}. ${element.text}
                                    </strong>
                                </p>

                                ${addAnswer(element)}
                        `;

                        element.sub_questions?.forEach(sub_question => {

                            shortquestionHtml += `
                                <div class="sub_question">

                                    <p>
                                        ${sub_question.label}) ${sub_question.text}
                                    </p>

                                    ${addAnswer(sub_question)}
                            `;

                            sub_question.sub_parts?.forEach(sub_part => {

                                shortquestionHtml += `
                                    <div class="sub_part">

                                        <p>
                                            ${sub_part.label}) ${sub_part.text}
                                        </p>

                                        ${addAnswer(sub_part)}

                                    </div>
                                `;

                            });

                            shortquestionHtml += `</div>`;

                        });

                        shortquestionHtml += `</div>`;

                    });

                    sectionByParts.insertAdjacentHTML(
                        'beforeend',
                        shortquestionHtml
                    );

                }

            });

        }


        // =========================
        // PART II EVENT LISTENERS
        // =========================

        container.addEventListener('click', event => {

            const copyElement = event.target.closest('.copy');

            if (copyElement && copyElement.closest('.question')) {

                const question = copyElement.closest('.question');
                const quiz = question.querySelector('p');

                navigator.clipboard.writeText(
                    quiz.textContent.trim()
                ).then(() => {
                    showToast('Copied to clipboard');
                }).catch(() => {
                    showToast('Could not copy', 'error');
                });

                return;
            }

            const hidele = event.target.closest('.blank_answer_btn');

            if (hidele && hidele.closest('.question')) {

                const currentQuestion = hidele.closest('.question');
                const answerDiv = currentQuestion.querySelector('.answer');

                answerDiv.style.display = 'block';
                hidele.style.display = 'none';

                return;
            }

            const collapseEl = event.target.closest('.collapse');

            if (collapseEl && collapseEl.closest('.question')) {

                const currentQuestion = collapseEl.closest('.question');
                const answerDiv = currentQuestion.querySelector('.answer');

                answerDiv.style.display = 'none';

                const answerButton =
                    currentQuestion.querySelector('.blank_answer_btn');

                if (answerButton) {
                    answerButton.style.display = 'inline-block';
                }

            }

        });


        // =========================
        // PART III EVENT LISTENERS
        // =========================

        container.addEventListener('click', e => {

            const copyElement = e.target.closest('.copy');

            if (!copyElement) return;

            const question = copyElement.closest('.question_item');

            if (!question) return;

            const questionText = question.innerText;

            navigator.clipboard.writeText(questionText)
                .then(() => {
                    showToast('Copied to clipboard');
                })
                .catch(error => {
                    console.error('Copy failed:', error);
                    showToast('Could not copy', 'error');
                });

        });


        container.addEventListener('click', e => {

            const wrapper = e.target.closest('.answer_wrapper');

            if (!wrapper) return;

            if (e.target.closest('.blank_answer_btn')) {

                wrapper.querySelector('.answer_content').hidden = false;

                wrapper.querySelector('.blank_answer_btn').hidden = true;

            }

            if (e.target.closest('.collapse')) {

                wrapper.querySelector('.answer_content').hidden = true;

                wrapper.querySelector('.blank_answer_btn').hidden = false;

            }

        });


        // =========================
        // MATHJAX
        // =========================

        // MATHJAX
// MATHJAX
if (window.MathJax && MathJax.startup && MathJax.startup.promise) {

    await MathJax.startup.promise;

    MathJax.typesetClear([container]);

    await MathJax.typesetPromise([container]);

    console.log('MathJax typesetting completed');

} else {
    console.error('MathJax has not loaded');
}

    }).catch(error => {

        console.error("Error loading exam:", error);

    });

} // Closing the else block git commit -m "Prepare Quizz+ for deployment"