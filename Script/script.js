const totalCount = document.getElementById("total-count");
const interviewCount = document.getElementById("interview-count");
const rejectedCount = document.getElementById("rejected-count");
let currentFilter = 'all';

function updateTotals()  {
    const posts = document.querySelectorAll(".job-post");
    const n = posts.length;
    if (totalCount) totalCount.textContent = n;
    const text = document.querySelector(".main-title p");
    if (text) text.textContent = `${n} job${n !== 1 ? "s" : ""}`;
}

function showPosts(filter){
    currentFilter = filter;
    const posts = document.querySelectorAll('.job-post');
    let visibleCount = 0;
    posts.forEach(p => {
        const state = p.getAttribute('data-state') || 'none';
        let show = false;
         if (filter === 'all') show = true;
         if (filter === 'interview' && state === 'interview') show = true;
         if (filter === 'rejected' && state === 'rejected') show = true;
         p.style.display = show ? '' : 'none';
         if (show) visibleCount += 1;
    });
    const noJobs = document.querySelector ('.no-job-posts');
    if  (noJobs) {
        if (filter === 'all') {
            noJobs.style.display = visibleCount ? 'none' : '';
        } else {
            noJobs.style.display = visibleCount ? 'none' : '';
        }
    }
    const jobsText = document.querySelector (".main-title p");
    if  (jobsText) {
        let count = visibleCount;
         if (filter === 'all') {
            count = document.querySelectorAll('.job-post').length;
        }
         jobsText.textContent = `${count} job${count !== 1 ? "s" : ""}`;
    }
}

function setState(btn)  {
    const  post =  btn.closest('.job-post');
     if (!post) return;
     post.querySelectorAll('.interview-btn, .rejected-btn').forEach(b => b.classList.remove('active'));
     if (btn.classList.contains('interview-btn')) post.setAttribute('data-state', 'interview');
     if (btn.classList.contains('rejected-btn')) post.setAttribute('data-state', 'rejected');
    btn.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    updateTotals();
    const filters = document.querySelectorAll('.filters button');
    filters.forEach(b => {b.addEventListener('click', () => {
            filters.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            const f = b.textContent.trim().toLowerCase();
            showPosts(f);
        });
    });
    if (filters.length) filters[0].classList.add('active');
    showPosts(currentFilter);

    document.querySelectorAll(".interview-btn").forEach(b => {
        b.addEventListener("click", () => {
            const post = b.closest('.job-post');
            const state = post ? post.getAttribute('data-state') : 'none';
            if (state !== 'interview') {
                if (state === 'rejected' && rejectedCount) {
                    let v = parseInt(rejectedCount.textContent || "0");
                    if (v > 0) rejectedCount.textContent = v - 1;
                }
                if (interviewCount) {
                    let v = parseInt(interviewCount.textContent || "0");
                    interviewCount.textContent = v + 1;
                }
            }
            setState(b);
            if (post) {
                const no = post.querySelector('.apply-status[data-state="none"]');
                const yes = post.querySelector('.apply-status[data-state="applied"]');
                if (no && yes) { no.style.display = 'none'; yes.style.display = ''; }
            }
            showPosts(currentFilter);
        });
    });

    document.querySelectorAll(".rejected-btn").forEach(b => {
        b.addEventListener("click", () => {
            if (b.disabled) return;
            const post = b.closest('.job-post');
            const state = post ? post.getAttribute('data-state') : 'none';
            if (state !== 'rejected') {
                if (state === 'interview' && interviewCount) {
                    let v = parseInt(interviewCount.textContent || "0");
                    if (v > 0) interviewCount.textContent = v - 1;
                }
                if (rejectedCount) {
                    let v = parseInt(rejectedCount.textContent || "0");
                    rejectedCount.textContent = v + 1;
                }
                b.disabled = true;
                b.style.cursor = 'not-allowed';
                b.style.opacity = '0.6';
                if (post) {
                    const iv = post.querySelector('.interview-btn');
                    if (iv) { iv.disabled = true; iv.style.cursor = 'not-allowed'; iv.style.opacity = '0.6'; }
                }
            }
            setState(b);
            showPosts(currentFilter);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(b => {
        b.addEventListener("click", () => {
            const post = b.closest('.job-post');
            if (!post) return;
            const state = post.getAttribute('data-state') || 'none';
            if (state === 'interview' && interviewCount) {
                let v = parseInt(interviewCount.textContent || "0");
                if (v > 0) interviewCount.textContent = v - 1;
            } else if (state === 'rejected' && rejectedCount) {
                let v = parseInt(rejectedCount.textContent || "0");
                if (v > 0) rejectedCount.textContent = v - 1;
            }
            post.remove();
            updateTotals();
            showPosts(currentFilter);
        });
    });
});
