/**
 * 삼일단지내부동산 허정미 대표 웹사이트 스크립트
 * app.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileDrawer();
  initSmoothScroll();
  initFaqAccordion();
  initSpaceEnergyQuiz();
  initConsultationForm();
  initScrollTopBtn();
  initServiceCardLinking();
});

/* --------------------------------------------------
   1. 상단 네비게이션 스크롤 효과
   -------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------
   2. 모바일 드로어 메뉴 제어
   -------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------
   3. 부드러운 스크롤 & 네비게이션
   -------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------
   4. 자주 묻는 질문 (FAQ) 아코디언
   -------------------------------------------------- */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // 다른 열려있는 항목 닫기
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.accordion-header');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      // 현재 항목 토글
      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------
   5. 공간·기운 간이 진단 퀴즈 인터랙션
   -------------------------------------------------- */
function initSpaceEnergyQuiz() {
  const seasonBtns = document.querySelectorAll('.season-options .quiz-btn');
  const wishBtns = document.querySelectorAll('.wish-options .quiz-btn');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');

  if (!seasonBtns.length || !wishBtns.length || !resultTitle || !resultDesc) return;

  let currentSeason = 'spring';
  let currentWish = 'wealth';

  // 계절과 소망별 조언 데이터베이스
  const adviceDatabase = {
    spring: {
      wealth: {
        title: "서북향의 안정된 금(金)·수(水) 기운을 갖춘 상가/주거",
        desc: "봄(木)에 태어나 활발한 기운을 가지신 분은 결실을 맺는 금(金)의 기운이 보완될 때 큰 재물이 모입니다. 현관이 단단하고 서쪽이나 북서쪽을 향하는 매물, 실내 중심부에 차분한 웜그레이와 브론즈 톤이 감도는 공간이 사업 번창에 가장 유리합니다."
      },
      health: {
        title: "아침 채광이 맑고 통풍이 원활한 남동향 힐링 주거",
        desc: "목(木)의 기운이 과열되지 않도록 맑은 바람과 오전 햇살을 듬뿍 받는 남동향 아파트가 최적입니다. 침실 머리 방향을 동남쪽으로 두고, 거실에 잎이 둥근 식물을 배치하면 피로 회복과 가족 평안에 큰 도움이 됩니다."
      },
      study: {
        title: "북향의 차분한 서재와 집중력이 머무는 안정된 동선",
        desc: "왕성한 호기심을 지혜로 응집시키기 위해 북쪽의 서늘하고 정적인 기운이 조화를 이룹니다. 서재나 공부방은 북서쪽에 배치하고 책상이 출입문을 등지지 않도록 배치하는 것을 권장합니다."
      },
      peace: {
        title: "단지내 녹지 조망과 흙(土)의 기운이 감싸는 편안한 안식처",
        desc: "뿌리를 내릴 수 있는 안정된 토(土) 기운이 필요합니다. 지상 조경과 나무가 한눈에 들어오는 중저층 아파트나 황토·베이지 컬러가 조화로운 공간에서 깊은 휴식을 얻으실 수 있습니다."
      }
    },
    summer: {
      wealth: {
        title: "수(水)의 윤택함이 감도는 북향·서향 중심의 수익형 부동산",
        desc: "여름(火)의 열정을 다스리고 재물의 결실을 맺기 위해 서늘한 물(水)과 금(金)의 기운이 깃든 터가 길합니다. 진입로가 평탄하고 물길이나 녹지 축이 인접한 상가/오피스가 막대한 금전운을 붇돋웁니다."
      },
      health: {
        title: "열기를 식혀주는 통풍 우수 동호수 및 차분한 블루/화이트 톤",
        desc: "심신이 편안하려면 맞바람이 잘 통하는 판상형 구조가 이상적입니다. 침실은 북쪽이나 서북쪽 벽면에 침대를 안정감 있게 배치하여 심리적 열감을 내려주는 것이 좋습니다."
      },
      study: {
        title: "차분하고 집중도 높은 북서쪽 학습 공간",
        desc: "열기를 차단하고 차분한 냉철함을 주는 북쪽 방이 학업 성취에 매우 유리합니다. 블루 그레이 계열의 포인트 인테리어와 함께 조도를 은은하게 조율해 드립니다."
      },
      peace: {
        title: "도심 속 정원과 수경 시설이 인접한 쾌적한 쉼터",
        desc: "자연 수경 시설이나 단지내 중앙공원 분수대가 조망되는 세대에서 심리적 평온과 새로운 영감을 얻으실 수 있습니다."
      }
    },
    autumn: {
      wealth: {
        title: "목(木)의 성장 에너지를 불어넣는 동남향 번창 터",
        desc: "가을(金)에 태어나 결단력이 뛰어난 분에게는 새로운 기회를 틔워주는 동쪽과 남쪽의 따스한 에너지가 큰 재물길을 엽니다. 활발한 유동인구 동선과 일조권이 뛰어난 1층 코너 상가가 적극 추천됩니다."
      },
      health: {
        title: "따뜻한 햇살이 오래 머무는 정남향 온기형 주거",
        desc: "차갑고 건조해지기 쉬운 체질이므로 하루 종일 햇살이 깊게 드는 정남향 세대가 가장 이상적입니다. 원목 소재의 인테리어와 온화한 간접조명이 건강운을 높여줍니다."
      },
      study: {
        title: "생기 넘치는 동쪽 방향의 창의적 서재",
        desc: "아침 해의 기운을 받는 동쪽 방에서 창의력과 추진력이 극대화됩니다. 책상 앞 시야를 트이게 배치하여 답답함을 해소하는 것이 핵심입니다."
      },
      peace: {
        title: "부드러운 곡선과 따스한 감성이 깃든 숲세권 아파트",
        desc: "직선적이고 날카로운 기운을 부드럽게 감싸주는 단지내 둘레길 및 숲세권 호수가 마음의 온전한 쉼을 선사합니다."
      }
    },
    winter: {
      wealth: {
        title: "화(火)와 토(土)의 온기가 가득한 남향 중심의 활력 터",
        desc: "겨울(水)의 깊은 지혜를 가진 분은 따뜻한 태양(火)의 기운을 만나야 재물이 비약적으로 증식합니다. 남향 및 남동향 상가나 활기찬 대로변 오피스가 최고의 명당입니다."
      },
      health: {
        title: "일조량이 풍부하고 온기가 흐르는 고층 로열동 주거",
        desc: "몸의 온기를 지켜주는 채광 우수 고층 세대가 건강에 최적입니다. 침실 벽면은 따뜻한 베이지 및 웜브론즈 톤으로 마감하고 조명을 따뜻한 전구색으로 연출하시길 권장합니다."
      },
      study: {
        title: "남동쪽 햇살을 받는 밝고 쾌적한 집중 공간",
        desc: "움츠러들기 쉬운 생각을 활짝 열어주는 남동향 방이 시험운과 합격운을 강력하게 끌어당깁니다."
      },
      peace: {
        title: "사계절 따뜻한 빛과 아늑함을 품은 남서향 힐링 세대",
        desc: "오후 늦게까지 온기가 스며드는 남서향 세대에서 얼어붙은 몸과 마음에 온화한 활력을 불어넣을 수 있습니다."
      }
    }
  };

  const updateQuizResult = () => {
    const data = adviceDatabase[currentSeason]?.[currentWish];
    if (data) {
      resultTitle.textContent = data.title;
      resultDesc.textContent = data.desc;
    }
  };

  seasonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      seasonBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSeason = btn.dataset.season;
      updateQuizResult();
    });
  });

  wishBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      wishBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentWish = btn.dataset.wish;
      updateQuizResult();
    });
  });
}

/* --------------------------------------------------
   6. 상담 신청 폼 검증 및 완료 모달 피드백
   -------------------------------------------------- */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  const modalBackdrop = document.getElementById('consultModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDetails = document.getElementById('modalDetails');

  if (!form || !modalBackdrop) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = form.userName.value.trim();
    const phone = form.userPhone.value.trim();
    const service = form.serviceType.value;
    const time = form.preferredTime.value;
    const area = form.preferredArea.value.trim() || '미정';
    const message = form.userMessage.value.trim();
    const privacy = form.privacyAgree.checked;

    if (!name) {
      alert('성함을 입력해 주세요.');
      form.userName.focus();
      return;
    }

    if (!phone) {
      alert('연락처를 입력해 주세요.');
      form.userPhone.focus();
      return;
    }

    if (!service) {
      alert('상담 희망 분야를 선택해 주세요.');
      form.serviceType.focus();
      return;
    }

    if (!privacy) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      form.privacyAgree.focus();
      return;
    }

    // 접수 번호 생성
    const receiptNum = 'SAMIL-' + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (modalDetails) {
      modalDetails.innerHTML = `
        <p><strong>접수 번호:</strong> ${receiptNum}</p>
        <p><strong>신청 일자:</strong> ${today}</p>
        <p><strong>신청자:</strong> ${name} 님 (${phone})</p>
        <p><strong>상담 분야:</strong> ${service}</p>
        <p><strong>희망 시간:</strong> ${time}</p>
        ${area !== '미정' ? `<p><strong>희망 지역/조건:</strong> ${area}</p>` : ''}
      `;
    }

    // 모달 표시
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // 폼 초기화
    form.reset();
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

/* --------------------------------------------------
   7. 서비스 카드 클릭 시 폼 분야 자동 선택
   -------------------------------------------------- */
function initServiceCardLinking() {
  const serviceLinks = document.querySelectorAll('.service-link');
  const serviceSelect = document.getElementById('serviceType');

  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetService = link.dataset.serviceType;
      if (serviceSelect && targetService) {
        serviceSelect.value = targetService;
      }
    });
  });
}

/* --------------------------------------------------
   8. 탑 스크롤 버튼 (Scroll to Top)
   -------------------------------------------------- */
function initScrollTopBtn() {
  const topBtn = document.getElementById('scrollTopBtn');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
