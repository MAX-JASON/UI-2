// 初始化粒子背景和启动画面 (iPad 优化版 )
document.addEventListener('DOMContentLoaded', function() {
    // 显示启动画面 (iPad 优化 )
    const splashScreen = document.getElementById('splashScreen');
    splashScreen.style.display = 'flex';
    
    // 初始化粒子效果 (iPad 性能优化 )
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', './particles.json', function() {
            console.log(' 粒子背景初始化成功 ');
            
            // iPad 上减少粒子数量提升性能
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                pJS.particles.number.value = 30;
                pJS.fn.particlesRefresh();
            }
            
            // 隐藏启动画面
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 300);
            }, 1000);
        });
    } else {
        // 如果粒子库加载失败，直接隐藏启动画面
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 300);
        }, 1000);
    }

    // iPad 横竖屏切换处理
    function handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('landscape', isLandscape);
        
        // 重新布局图表
        if (window.Chart) {
            Chart.instances.forEach(instance => instance.resize());
        }
    }
    window.addEventListener('orientationchange', handleOrientationChange);
    handleOrientationChange();

    // PWA 安装提示 (iPad 优化 )
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // 只在桌面或 iPad 上显示安装按钮
        if (!/iPad|iPhone|iPod/.test(navigator.userAgent) || 
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
            const installBtn = document.createElement('button');
            installBtn.id = 'installBtn';
            installBtn.className = 'btn btn-tech';
            installBtn.innerHTML = '<i class="fas fa-download"></i> 安装应用 ';
            installBtn.style.position = 'fixed';
            installBtn.style.bottom = '20px';
            installBtn.style.right = '20px';
            installBtn.style.zIndex = '1000';
            document.body.appendChild(installBtn);
            
            installBtn.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        installBtn.style.display = 'none';
                    }
                    deferredPrompt = null;
                });
            });
        }
    });

    // 更新当前时间
    function updateDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        document.getElementById('current-datetime').textContent = now.toLocaleDateString('zh-TW', options);
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // iPad 触摸事件优化
    document.addEventListener('touchstart', function(e) {
        // 防止快速点击
        if (e.timeStamp - (this.lastTouch || 0) < 500) {
            e.preventDefault();
            return;
        }
        this.lastTouch = e.timeStamp;
    }, {passive: true});

    // 防止橡皮筋效果
    document.addEventListener('touchmove', function(e) {
        if (!e.target.closest('.scrollable')) {
            e.preventDefault();
        }
    }, {passive: false});

    // 初始化 Bootstrap 标签页 (iPad 兼容 )
    const tabElms = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabElms.forEach(tabEl => {
        tabEl.addEventListener('click', function(e) {
            e.preventDefault();
            const tabTarget = this.getAttribute('data-bs-target');
            const tabPane = document.querySelector(tabTarget);
            if (tabPane) {
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                tabPane.classList.add('show', 'active');
                
                // iPad 上滚动到顶部
                if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                    setTimeout(() => {
                        tabPane.scrollTo(0, 0);
                    }, 10);
                }
            }
        });
        
        // iPad 触摸优化
        tabEl.style.minWidth = '44px';
        tabEl.style.minHeight = '44px';
    });

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error(' 应用程序错误 :', e.message, e.filename, e.lineno);
    });
});
