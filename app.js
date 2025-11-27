// Trivo App - Complete Combined JavaScript
class TrivoApp {
    constructor() {
        this.currentUser = null;
        this.currentCategory = 'trending';
        this.currentSection = 'homeSection';
        this.videoFeed = [];
        this.reels = [];
        this.currentReelIndex = 0;
        this.isPlaying = true;
        this.isAdPlaying = false;
        this.musicPlaying = false;
        
        this.apiKeys = {
            YOUTUBE: 'AIzaSyA58yxQqa5XRSh2TY90kEVWxQ_u2xMxXAo',
            PEXELS: '53118702-89a52dcb945052ecab296e696'
        };
        
        this.init();
    }

    init() {
        this.showSplashScreen();
        setTimeout(() => {
            this.checkUserSignup();
        }, 2000);
    }

    showSplashScreen() {
        this.showScreen('splashScreen');
    }

    showSignupScreen() {
        this.showScreen('signupScreen');
        this.setupSignupForm();
    }

    showAppScreen() {
        this.showScreen('appScreen');
        this.loadUserData();
        this.setupApp();
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenName).classList.add('active');
    }

    checkUserSignup() {
        if (localStorage.getItem('trivo_signed_up') === 'true') {
            this.showAppScreen();
        } else {
            this.showSignupScreen();
        }
    }

    setupSignupForm() {
        const form = document.getElementById('signup-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                age: document.getElementById('age').value,
                gender: document.querySelector('input[name="gender"]:checked')?.value,
                interests: Array.from(document.querySelectorAll('input[name="interests"]:checked'))
                    .map(checkbox => checkbox.value)
            };
            
            if (formData.interests.length < 2) {
                alert('Please select at least 2 interests!');
                return;
            }
            
            localStorage.setItem('trivo_user', JSON.stringify(formData));
            localStorage.setItem('trivo_signed_up', 'true');
            
            this.showAppScreen();
        });
    }

    loadUserData() {
        const userData = localStorage.getItem('trivo_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            document.getElementById('userName').textContent = this.currentUser.name;
        }
    }

    setupApp() {
        this.setupNavigation();
        this.setupCategories();
        this.setupSearch();
        this.loadHomeFeed();
        this.setupReels();
    }

    setupNavigation() {
        // Bottom nav active states are handled by showSection
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.app-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(sectionId).classList.add('active');
        this.currentSection = sectionId;
        
        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Update bottom nav active state based on section
        const navMap = {
            'homeSection': 0,
            'reelsSection': 1,
            'musicSection': 2,
            'moviesSection': 3,
            'profileSection': 4
        };
        
        document.querySelectorAll('.nav-item')[navMap[sectionId]]?.classList.add('active');
        
        // Load section-specific content
        if (sectionId === 'reelsSection') {
            this.loadReels();
        } else if (sectionId === 'homeSection') {
            this.loadHomeFeed();
        }
    }

    setupCategories() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                
                this.currentCategory = e.target.dataset.category;
                this.loadHomeFeed();
            });
        });
    }

    setupSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-bar input');
        
        searchBtn.addEventListener('click', () => this.handleSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch(searchInput.value);
        });
    }

    handleSearch(query) {
        if (query.trim()) {
            alert(`Searching for: ${query}`);
            // Implement actual search later
        }
    }

    async loadHomeFeed() {
        const videoFeed = document.getElementById('videoFeed');
        videoFeed.innerHTML = '<div class="loading-spinner">Loading your content...</div>';

        try {
            const videos = await this.fetchVideos();
            this.displayVideos(videos);
        } catch (error) {
            console.error('Error loading feed:', error);
            const fallbackVideos = this.getFallbackVideos();
            this.displayVideos(fallbackVideos);
        }
    }

    async fetchVideos() {
        // Mock API call - replace with actual API later
        return new Promise((resolve) => {
            setTimeout(() => {
                const videos = [
                    {
                        id: 1,
                        title: 'Amazing Tech Review You Must Watch in 2024',
                        thumbnail: 'tech',
                        duration: '10:25',
                        views: '1.2M',
                        channel: 'Tech Guru'
                    },
                    {
                        id: 2,
                        title: 'Bollywood Latest Song - Dance Performance',
                        thumbnail: 'music',
                        duration: '3:45',
                        views: '5.7M',
                        channel: 'Music India'
                    },
                    {
                        id: 3,
                        title: 'Funny Comedy Skit That Will Make You Laugh Hard',
                        thumbnail: 'comedy',
                        duration: '2:15',
                        views: '2.3M',
                        channel: 'Comedy Central'
                    },
                    {
                        id: 4,
                        title: 'Cricket Highlights - Amazing Match Moments',
                        thumbnail: 'sports',
                        duration: '8:30',
                        views: '3.4M',
                        channel: 'Sports Action'
                    },
                    {
                        id: 5,
                        title: 'Motivational Speech That Will Change Your Life',
                        thumbnail: 'motivation',
                        duration: '15:20',
                        views: '1.8M',
                        channel: 'Inspire Daily'
                    }
                ];
                resolve(videos);
            }, 1000);
        });
    }

    getFallbackVideos() {
        return [
            {
                id: 'fallback-1',
                title: 'Trending Video - Viral Content',
                thumbnail: 'trending',
                duration: '5:45',
                views: '2.1M',
                channel: 'Viral Hub'
            },
            {
                id: 'fallback-2',
                title: 'News Update - Latest Headlines',
                thumbnail: 'news', 
                duration: '8:15',
                views: '1.5M',
                channel: 'News Network'
            }
        ];
    }

    displayVideos(videos) {
        const videoFeed = document.getElementById('videoFeed');
        videoFeed.innerHTML = '';

        videos.forEach((video, index) => {
            const videoCard = this.createVideoCard(video);
            videoFeed.appendChild(videoCard);

            // Add ad after every 3 videos
            if ((index + 1) % 3 === 0) {
                const adContainer = this.createAdContainer();
                videoFeed.appendChild(adContainer);
            }
        });
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-thumbnail">
                ${this.getThumbnailIcon(video.thumbnail)}
                <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-meta">
                    <span>${video.channel}</span>
                    <span>${video.views} views</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.playVideo(video);
        });

        return card;
    }

    getThumbnailIcon(type) {
        const icons = {
            tech: '📱',
            music: '🎵',
            comedy: '😂',
            sports: '⚽',
            motivation: '💪',
            trending: '🔥',
            news: '📰'
        };
        return icons[type] || '🎬';
    }

    createAdContainer() {
        const ad = document.createElement('div');
        ad.className = 'ad-container';
        ad.innerHTML = `
            <div class="ad-label">ADVERTISEMENT</div>
            <div>Sponsored Content - Try Our Premium Features!</div>
        `;
        return ad;
    }

    playVideo(video) {
        alert(`Now Playing: ${video.title}\nChannel: ${video.channel}`);
    }

    // Reels functionality
    async loadReels() {
        const reelsContainer = document.getElementById('reelsContainer');
        reelsContainer.innerHTML = '<div class="loading-reels">Loading reels...</div>';

        try {
            this.reels = await this.fetchReels();
            this.renderReels();
            this.showReel(0);
            this.setupReelsGestures();
        } catch (error) {
            console.error('Error loading reels:', error);
            this.reels = this.getFallbackReels();
            this.renderReels();
            this.showReel(0);
            this.setupReelsGestures();
        }
    }

    async fetchReels() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const reels = [
                    {
                        id: 1,
                        creator: '@nature_lover',
                        description: 'Beautiful nature scenery 🌸 #nature #beautiful',
                        likes: '12.4K',
                        comments: '1.2K',
                        isAd: false
                    },
                    {
                        id: 2,
                        creator: '@dance_queen', 
                        description: 'Friday night vibes! 💃 #dance #party',
                        likes: '8.7K',
                        comments: '893',
                        isAd: false
                    },
                    {
                        id: 3,
                        creator: '@travel_diary',
                        description: 'Mountain adventures 🏔️ #travel #wanderlust',
                        likes: '15.2K',
                        comments: '2.1K',
                        isAd: false
                    },
                    {
                        id: 'ad-1',
                        creator: 'Sponsored',
                        description: 'Check out this amazing product! #ad',
                        likes: '0',
                        comments: '0',
                        isAd: true
                    }
                ];
                resolve(reels);
            }, 1500);
        });
    }

    getFallbackReels() {
        return [
            {
                id: 'fallback-1',
                creator: '@foodie_chef',
                description: 'Delicious recipe tutorial! 🍳 #cooking #food',
                likes: '9.8K',
                comments: '1.5K',
                isAd: false
            },
            {
                id: 'fallback-2',
                creator: '@skate_pro',
                description: 'New skateboard tricks 🛹 #skate #extreme',
                likes: '17.6K', 
                comments: '2.8K',
                isAd: false
            }
        ];
    }

    renderReels() {
        const reelsContainer = document.getElementById('reelsContainer');
        reelsContainer.innerHTML = '';

        this.reels.forEach((reel, index) => {
            const reelElement = this.createReelElement(reel, index);
            reelsContainer.appendChild(reelElement);
        });
    }

    createReelElement(reel, index) {
        const reelDiv = document.createElement('div');
        reelDiv.className = `reel-item ${index === 0 ? 'active' : ''}`;
        reelDiv.dataset.index = index;
        
        const colors = ['#FF0084', '#00eaff', '#D400FF', '#00ff88', '#ff6b6b'];
        const color = colors[index % colors.length];
        
        reelDiv.innerHTML = `
            <div class="reel-video" style="background: linear-gradient(45deg, ${color}, #000); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                ${reel.isAd ? 'AD CONTENT' : 'REEL ' + (index + 1)}
            </div>
            ${reel.isAd ? '<div class="ad-badge">AD</div>' : ''}
        `;

        return reelDiv;
    }

    showReel(index) {
        document.querySelectorAll('.reel-item').forEach(reel => {
            reel.classList.remove('active');
        });

        const currentReel = document.querySelector(`.reel-item[data-index="${index}"]`);
        if (currentReel) {
            currentReel.classList.add('active');
            this.currentReelIndex = index;
            this.updateReelInfo(this.reels[index]);
        }
    }

    updateReelInfo(reel) {
        const creatorName = document.querySelector('.creator-name');
        const reelDescription = document.querySelector('.reel-description');
        const likeCount = document.querySelector('.action-btn:nth-child(1) .action-count');
        const commentCount = document.querySelector('.action-btn:nth-child(2) .action-count');
        const followBtn = document.querySelector('.follow-btn');

        if (creatorName) creatorName.textContent = reel.creator;
        if (reelDescription) reelDescription.textContent = reel.description;
        if (likeCount) likeCount.textContent = reel.likes;
        if (commentCount) commentCount.textContent = reel.comments;
        if (followBtn) followBtn.style.display = reel.isAd ? 'none' : 'block';
    }

    setupReels() {
        // Initial reels setup
    }

    setupReelsGestures() {
        let startY = 0;
        let currentY = 0;

        document.addEventListener('touchstart', (e) => {
            if (this.currentSection === 'reelsSection') {
                startY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (this.currentSection === 'reelsSection') {
                currentY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchend', (e) => {
            if (this.currentSection === 'reelsSection') {
                const diffY = startY - currentY;
                const minSwipeDistance = 50;

                if (Math.abs(diffY) > minSwipeDistance) {
                    if (diffY > 0) {
                        this.nextReel();
                    } else {
                        this.previousReel();
                    }
                }
            }
        });

        // Keyboard support for development
        document.addEventListener('keydown', (e) => {
            if (this.currentSection === 'reelsSection') {
                if (e.key === 'ArrowDown') {
                    this.nextReel();
                } else if (e.key === 'ArrowUp') {
                    this.previousReel();
                }
            }
        });
    }

    nextReel() {
        if (this.currentReelIndex < this.reels.length - 1) {
            this.showReel(this.currentReelIndex + 1);
        }
    }

    previousReel() {
        if (this.currentReelIndex > 0) {
            this.showReel(this.currentReelIndex - 1);
        }
    }

    // Reels interaction handlers
    handleLike(button) {
        const countElement = button.querySelector('.action-count');
        let count = parseInt(countElement.textContent.replace('K', '')) * 1000 || 1200;
        count += 1;
        countElement.textContent = this.formatCount(count);
        
        button.querySelector('span:first-child').textContent = '❤️';
        this.showLikeAnimation();
    }

    handleComment() {
        alert('Comments feature coming soon!');
    }

    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this reel on Trivo!',
                text: 'Amazing content on Trivo app',
                url: window.location.href
            });
        } else {
            alert('Share this reel with your friends!');
        }
    }

    handleSave(button) {
        const icon = button.querySelector('span:first-child');
        icon.textContent = icon.textContent === '⭐' ? '✅' : '⭐';
        alert('Reel saved to your collection!');
    }

    showLikeAnimation() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.fontSize = '5rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'heartAnimation 1s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            document.body.removeChild(heart);
        }, 1000);
    }

    formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    // Music functionality
    playMusic(playlist) {
        const player = document.getElementById('musicPlayer');
        const trackTitle = player.querySelector('.track-title');
        const trackArtist = player.querySelector('.track-artist');
        
        trackTitle.textContent = `Now Playing: ${playlist}`;
        trackArtist.textContent = 'Trivo Music - Unlimited Songs';
        
        alert(`Starting playlist: ${playlist}`);
    }

    togglePlay() {
        this.musicPlaying = !this.musicPlaying;
        const playBtn = document.querySelector('.play-btn');
        playBtn.textContent = this.musicPlaying ? '⏸️' : '▶️';
        
        if (this.musicPlaying) {
            alert('Music started playing');
        } else {
            alert('Music paused');
        }
    }

    previousTrack() {
        alert('Previous track');
    }

    nextTrack() {
        alert('Next track');
    }

    // Movies functionality
    playMovie(movie) {
        alert(`Now Playing: ${movie}\nEnjoy your movie!`);
    }

    // Profile functionality
    showSettings() {
        alert('Settings panel opening soon!');
    }

    showInterests() {
        alert('Change your interests - feature coming soon!');
    }

    showHistory() {
        alert('Watch history - see what you have watched!');
    }

    contactSupport() {
        alert('Contact support at: support@trivoapp.com');
    }
}

// Initialize the app
const app = new TrivoApp();
