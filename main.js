// --- JQUERY: Scroll halus untuk tautan navbar ---
$(document).ready(function() {
  $('.navbar a').on('click', function(e) {
    const href = $(this).attr('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(href).offset().top
      }, 600);
    }
  });
});

// --- JQUERY: Animasi kartu dan anggota tim saat discroll ---
function animateOnScroll(selector, animationClass) {
  function checkAndAnimate() {
    $(selector).each(function() {
      const elemTop = $(this).offset().top;
      const winBottom = $(window).scrollTop() + $(window).height();
      if (winBottom > elemTop + 40) {
        $(this).addClass(animationClass);
      }
    });
  }
  $(window).on('scroll resize', checkAndAnimate);
  $(document).ready(checkAndAnimate);
}

// Tambahkan kelas CSS untuk animasi (jika belum ada)
if (!document.getElementById('dynamic-animations')) {
  const style = document.createElement('style');
  style.id = 'dynamic-animations';
  style.innerHTML = `
    .fade-slide-up {
      opacity: 1 !important;
      transform: translateY(0) !important;
      transition: opacity 0.8s cubic-bezier(.4,2,.3,1), transform 0.8s cubic-bezier(.4,2,.3,1);
    }
    .collection-card, .event-card, .team-member, .card {
      opacity: 0;
      transform: translateY(40px);
    }
    .pulse-anim {
      animation: pulseBtn 0.7s;
    }
    @keyframes pulseBtn {
      0% { transform: scale(1);}
      50% { transform: scale(1.08);}
      100% { transform: scale(1);}
    }
    .bounce-in {
      animation: bounceIn 0.7s;
    }
    @keyframes bounceIn {
      0% { transform: scale(0.7);}
      60% { transform: scale(1.15);}
      80% { transform: scale(0.95);}
      100% { transform: scale(1);}
    }
  `;
  document.head.appendChild(style);
}

// Animasi saat scroll untuk berbagai elemen
$(function() {
  animateOnScroll('.collection-card', 'fade-slide-up');
  animateOnScroll('.event-card', 'fade-slide-up');
  animateOnScroll('.team-member', 'fade-slide-up');
  animateOnScroll('.card', 'fade-slide-up');
});

// --- REACT: Tombol Kembali ke Atas dengan animasi bounce ---
const e = React.createElement;

class BackToTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, bounce: false };
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll() {
    const shouldShow = window.scrollY > 200;
    if (shouldShow && !this.state.visible) {
      this.setState({ visible: true, bounce: true });
      setTimeout(() => this.setState({ bounce: false }), 700);
    } else if (!shouldShow && this.state.visible) {
      this.setState({ visible: false, bounce: false });
    }
  }
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  render() {
    if (!this.state.visible) return null;
    return e(
      'button',
      {
        onClick: this.scrollTop,
        className: this.state.bounce ? 'bounce-in' : '',
        style: {
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#ffbf00',
          color: '#111',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          fontSize: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 1000
        },
        title: 'Kembali ke atas'
      },
      '↑'
    );
  }
}

// --- REACT: Animasi pulse untuk .btn-primary saat hover ---
class PulseButtonEffect extends React.Component {
  componentDidMount() {
    // Gunakan event delegation untuk semua .btn-primary
    document.body.addEventListener('mouseenter', this.handleMouseEnter, true);
  }
  componentWillUnmount() {
    document.body.removeEventListener('mouseenter', this.handleMouseEnter, true);
  }
  handleMouseEnter(e) {
    if (e.target.classList && e.target.classList.contains('btn-primary')) {
      e.target.classList.add('pulse-anim');
      setTimeout(() => e.target.classList.remove('pulse-anim'), 700);
    }
  }
  render() { return null; }
}

// --- REACT: Carousel Ruang Revolver dengan teks terpisah ---
class RuangRevolver extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: 0, prev: 0, anim: null };
    this.ruang = [
      {
        img: "assets/ruang1.jpg",
        title: "Sejarah Layanan Informasi dan Alat Komunikasi di Indonesia - Ruang Pamer (Lantai 1)",
        desc: "Masuki lorong waktu menuju masa lalu! Pelajari cara komunikasi masyarakat Indonesia dari zaman dahulu, serta temui alat-alat komunikasi yang sudah jarang kita gunakan sekarang, dan berkenalan juga dengan Juru Penerang."
      },
      {
        img: "assets/ruang2.jpg",
        title: "Perkembangan Komunikasi hingga Masa Kini - Relief (Lantai 2)",
        desc: "Nikmati cerita tentang komunikasi sejak keberadaan manusia pertama hingga saat ini yang disajikan melalui relief sepanjang 100 meter."
      },
      {
        img: "assets/ruang3.jpg",
        title: "Bijak Berkomunikasi di Masa Kini - Ruang Pamer (Lantai 2)",
        desc: "Rasakan pengalaman baru bermain dan belajar komunikasi melalui wahana digital! Kenali ciri-ciri hoax dan cara membasminya."
      }
    ];
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.handleAnimEnd = this.handleAnimEnd.bind(this);
    this.animTimeout = null;
    this.updateInfo = this.updateInfo.bind(this);
  }
  componentDidMount() {
    this.updateInfo(this.state.selected);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selected !== this.state.selected) {
      this.updateInfo(this.state.selected);
    }
  }
  updateInfo(idx) {
    const infoDiv = document.getElementById('ruang-info-separate');
    if (infoDiv) {
      const ruang = this.ruang[idx];
      infoDiv.innerHTML =
        `<div class="ruang-info-separate">
          <h3>${ruang.title}</h3>
          <p style="font-weight:normal;">${ruang.desc}</p>
        </div>`;
    }
  }
  prev() {
    if (this.state.anim) return;
    const prevIdx = this.state.selected;
    const nextIdx = (prevIdx + this.ruang.length - 1) % this.ruang.length;
    this.setState({ anim: 'left', prev: prevIdx, selected: nextIdx });
    clearTimeout(this.animTimeout);
    this.animTimeout = setTimeout(() => this.setState({ anim: null }), 600);
  }
  next() {
    if (this.state.anim) return;
    const prevIdx = this.state.selected;
    const nextIdx = (prevIdx + 1) % this.ruang.length;
    this.setState({ anim: 'right', prev: prevIdx, selected: nextIdx });
    clearTimeout(this.animTimeout);
    this.animTimeout = setTimeout(() => this.setState({ anim: null }), 600);
  }
  handleAnimEnd() {
    this.setState({ anim: null });
  }
  render() {
    const { selected, prev, anim } = this.state;
    return e(
      'div',
      { className: 'ruang-revolver-container' },
      e('button', {
        className: 'ruang-arrow ruang-arrow-left',
        onClick: this.prev,
        'aria-label': 'Sebelumnya'
      }, '⟨'),
      this.ruang.map((r, i) => {
        // Hanya tampilkan yang terpilih atau sebelumnya (untuk animasi)
        if (i !== selected && (anim === null || i !== prev)) return null;
        let className = 'ruang-revolver-item';
        if (i === selected) className += ' selected';
        if (anim && i === prev) className += anim === 'left' ? ' spin-left' : ' spin-right';
        return e('div', {
          key: i,
          className,
          style: { display: 'flex' },
          onAnimationEnd: this.handleAnimEnd
        },
          e('img', { src: r.img, alt: r.title })
        );
      }),
      e('button', {
        className: 'ruang-arrow ruang-arrow-right',
        onClick: this.next,
        'aria-label': 'Selanjutnya'
      }, '⟩')
    );
  }
}

// --- CAROUSEL TESTIMONI ---
const testimoniData = [
  {
    img: "assets/testi1.jpg",
    name: "Yosi Mokalu",
    title: "Ketua Siberkreasi",
    text: "Museum Penerangan ini sesuai dengan namanya, tetap menjadi terang di masa pandemi yang gelap ini. Tetap terlihat berfungsi dan berkontribusi bagi kecerdasan bangsa dengan giat mengadakan kegiatan-kegiatan edukasi virtual, salut!"
  },
  {
    img: "assets/testi2.jpg",
    name: "Dewi Lestari",
    title: "Penulis & Musisi",
    text: "Muspen selalu menghadirkan inovasi dalam edukasi publik. Koleksinya menarik dan relevan untuk generasi muda."
  },
  {
    img: "assets/testi3.jpg",
    name: "Bambang Pamungkas",
    title: "Pemerhati Budaya",
    text: "Tempat yang inspiratif untuk belajar sejarah komunikasi Indonesia. Anak-anak saya suka sekali berkunjung ke sini."
  }
];

function renderTestimoni(idx) {
  const t = testimoniData[idx];
  document.getElementById('testimoni-card').innerHTML = `
    <div>
      <img src="${t.img}" alt="${t.name}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;margin-bottom:1rem;">
      <div style="font-weight:900;font-size:1.2rem;">${t.name}</div>
      <div style="color:#888;font-size:0.98rem;margin-bottom:1.2rem;">${t.title}</div>
      <div style="font-size:1.08rem;line-height:1.7;color:#333;">${t.text}</div>
    </div>
  `;
}
let testiIdx = 0;
function showTestimoni(idx) {
  testiIdx = (idx + testimoniData.length) % testimoniData.length;
  renderTestimoni(testiIdx);
}
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('testimoni-card')) {
    renderTestimoni(testiIdx);
    document.getElementById('testimoni-prev').onclick = () => showTestimoni(testiIdx - 1);
    document.getElementById('testimoni-next').onclick = () => showTestimoni(testiIdx + 1);
  }
});

// Mount revolver hanya jika root tersedia
document.addEventListener('DOMContentLoaded', function() {
  const backToTopDiv = document.createElement('div');
  document.body.appendChild(backToTopDiv);
  ReactDOM.render(
    React.createElement(React.Fragment, null,
      e(BackToTop),
      e(PulseButtonEffect)
    ),
    backToTopDiv
  );

  const revolverRoot = document.getElementById('ruang-revolver-root');
  if (revolverRoot) {
    ReactDOM.render(e(RuangRevolver), revolverRoot);
  }
});
