(function () {
  if (!window.CMS || !window.createClass || !window.h) {
    console.error('BUD-WEL: Decap CMS preview API is unavailable.');
    return;
  }

  var h = window.h;
  var createClass = window.createClass;

  var css = `
    html, body { margin:0; padding:0; background:#f5f2eb; color:#202723; font-family:Arial,Helvetica,sans-serif; }
    .bw-preview { background:#f5f2eb; color:#202723; font-family:Arial,Helvetica,sans-serif; }
    .bw-preview * { box-sizing:border-box; }
    .bw-preview .bw-top { background:#17211e; color:#fff; padding:13px 5%; display:flex; justify-content:space-between; align-items:center; gap:14px; }
    .bw-preview .bw-logo { font-size:22px; font-weight:900; letter-spacing:.09em; }
    .bw-preview .bw-logo small { display:block; color:#e8d6b8; font-size:8px; font-weight:500; letter-spacing:.28em; margin-top:3px; }
    .bw-preview .bw-nav { color:#e8e5dd; font-size:11px; }
    .bw-preview .bw-hero { min-height:390px; padding:72px 7%; color:#fff; background:linear-gradient(90deg,rgba(10,19,16,.94),rgba(10,19,16,.72)),#17211e; display:flex; align-items:center; }
    .bw-preview .bw-hero-inner { max-width:760px; }
    .bw-preview .bw-eyebrow { color:#d6b88d; text-transform:uppercase; letter-spacing:.18em; font-size:10px; font-weight:700; margin:0 0 18px; }
    .bw-preview .bw-hero h1 { font-size:clamp(36px,6vw,66px); line-height:1.02; letter-spacing:-.055em; white-space:pre-line; margin:0 0 20px; font-weight:800; }
    .bw-preview .bw-hero p { color:#e6e8e2; font-size:16px; line-height:1.65; max-width:570px; margin:0; }
    .bw-preview .bw-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:25px; }
    .bw-preview .bw-btn { display:inline-block; border:1px solid #c6ad87; padding:11px 15px; color:#fff; font-size:11px; }
    .bw-preview .bw-btn.alt { background:#b99a67; border-color:#b99a67; color:#17211e; }
    .bw-preview .bw-section { padding:52px 7%; }
    .bw-preview .bw-section.dark { background:#17211e; color:#fff; }
    .bw-preview .bw-section-head { max-width:700px; margin-bottom:25px; }
    .bw-preview .bw-section h2 { font-size:clamp(27px,4vw,42px); line-height:1.08; letter-spacing:-.04em; white-space:pre-line; margin:0 0 13px; }
    .bw-preview .bw-section p { color:#68716b; line-height:1.65; font-size:14px; }
    .bw-preview .dark p { color:#d4d8d2; }
    .bw-preview .bw-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
    .bw-preview .bw-service { border:1px solid #dedbd3; padding:19px; min-height:110px; background:#faf9f5; }
    .bw-preview .bw-service b { display:block; font-size:15px; margin-bottom:8px; }
    .bw-preview .bw-service p { margin:0; font-size:12px; }
    .bw-preview .bw-about { display:grid; grid-template-columns:1fr 1fr; gap:28px; align-items:start; }
    .bw-preview .bw-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
    .bw-preview .bw-tag { border:1px solid #b99a67; padding:7px 10px; font-size:10px; color:#725b36; }
    .bw-preview .bw-news { border-top:1px solid #dedbd3; padding-top:16px; margin-top:12px; }
    .bw-preview .bw-contact { background:#17211e; color:#fff; padding:48px 7%; }
    .bw-preview .bw-contact h2 { font-size:clamp(30px,4vw,48px); line-height:1.05; white-space:pre-line; margin:0 0 14px; }
    .bw-preview .bw-contact p { color:#d4d8d2; line-height:1.6; }
    .bw-preview .bw-contact-meta { color:#e8d6b8; font-size:12px; line-height:1.9; margin-top:20px; }
    .bw-preview .bw-footer { background:#111916; color:#aeb7af; padding:18px 7%; font-size:10px; }
    .bw-preview .bw-controls { background:#fff; border-bottom:1px solid #ddd8ce; padding:10px 14px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; font-size:11px; color:#465149; }
    .bw-preview .bw-controls label { display:flex; align-items:center; gap:6px; }
    .bw-preview .bw-controls input { width:90px; }
    .bw-preview .bw-controls select { font:inherit; padding:4px; }
    .bw-preview .bw-controls strong { color:#17211e; }
    @media(max-width:650px) {
      .bw-preview .bw-nav { display:none; }
      .bw-preview .bw-hero { min-height:340px; padding:54px 7%; }
      .bw-preview .bw-grid { grid-template-columns:1fr; }
      .bw-preview .bw-about { grid-template-columns:1fr; }
      .bw-preview .bw-section { padding:38px 7%; }
    }
  `;

  window.CMS.registerPreviewStyle(css, { raw: true });

  var SitePreview = createClass({
    getInitialState: function () {
      return { titleSize: 66, textSize: 16, align: 'left' };
    },
    handleTitleSize: function (event) {
      this.setState({ titleSize: Number(event.target.value) });
    },
    handleTextSize: function (event) {
      this.setState({ textSize: Number(event.target.value) });
    },
    handleAlign: function (event) {
      this.setState({ align: event.target.value });
    },
    render: function () {
      var data = this.props.entry.get('data');
      var get = function (key) {
        var value = data && data.get ? data.get(key) : '';
        return value == null ? '' : String(value);
      };
      var services = data && data.get ? data.get('services') : null;
      var news = data && data.get ? data.get('news') : null;
      var tags = get('about_tags').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      var titleStyle = { fontSize: this.state.titleSize + 'px', textAlign: this.state.align };
      var heroTextStyle = { fontSize: this.state.textSize + 'px', textAlign: this.state.align };
      var serviceCards = [];
      if (services && services.forEach) {
        services.forEach(function (item, index) {
          serviceCards.push(h('article', { className: 'bw-service', key: 's' + index },
            h('b', null, item.get('title') || 'Usługa'),
            h('p', null, item.get('description') || '')
          ));
        });
      }
      var newsCards = [];
      if (news && news.forEach) {
        news.forEach(function (item, index) {
          if (item.get('published') === false) return;
          newsCards.push(h('article', { className: 'bw-news', key: 'n' + index },
            h('b', null, item.get('title') || ''),
            item.get('date') ? h('small', null, ' · ' + item.get('date')) : null,
            h('p', null, item.get('body') || '')
          ));
        });
      }

      return h('div', { className: 'bw-preview' },
        h('div', { className: 'bw-controls' },
          h('strong', null, 'Ustawienia podglądu (tymczasowe)'),
          h('label', null, 'Nagłówek',
            h('input', { type: 'range', min: 32, max: 88, value: this.state.titleSize, onChange: this.handleTitleSize })
          ),
          h('span', null, this.state.titleSize + ' px'),
          h('label', null, 'Opis',
            h('input', { type: 'range', min: 12, max: 24, value: this.state.textSize, onChange: this.handleTextSize })
          ),
          h('span', null, this.state.textSize + ' px'),
          h('label', null, 'Wyrównanie',
            h('select', { value: this.state.align, onChange: this.handleAlign },
              h('option', { value: 'left' }, 'Do lewej'),
              h('option', { value: 'center' }, 'Do środka'),
              h('option', { value: 'right' }, 'Do prawej')
            )
          )
        ),
        h('header', { className: 'bw-top' },
          h('div', { className: 'bw-logo' }, 'BUD-WEL', h('small', null, 'PIOTR CZAPLIŃSKI')),
          h('div', { className: 'bw-nav' }, 'USŁUGI　 REALIZACJE　 O FIRMIE　 KONTAKT')
        ),
        h('section', { className: 'bw-hero' },
          h('div', { className: 'bw-hero-inner', style: { width: '100%' } },
            h('div', { className: 'bw-eyebrow', style: { textAlign: this.state.align } }, get('hero_eyebrow')),
            h('h1', { style: titleStyle }, get('hero_title')),
            h('p', { style: heroTextStyle }, get('hero_text')),
            h('div', { className: 'bw-actions' },
              h('span', { className: 'bw-btn alt' }, get('hero_primary')),
              h('span', { className: 'bw-btn' }, get('hero_secondary'))
            )
          )
        ),
        h('section', { className: 'bw-section' },
          h('div', { className: 'bw-section-head' },
            h('div', { className: 'bw-eyebrow' }, get('services_eyebrow')),
            h('h2', null, get('services_title')),
            h('p', null, get('services_intro'))
          ),
          h('div', { className: 'bw-grid' }, serviceCards)
        ),
        h('section', { className: 'bw-section dark' },
          h('div', { className: 'bw-about' },
            h('div', null,
              h('div', { className: 'bw-eyebrow' }, get('about_eyebrow')),
              h('h2', null, get('about_title'))
            ),
            h('div', null,
              h('p', null, get('about_paragraph_1')),
              h('p', null, get('about_paragraph_2')),
              h('div', { className: 'bw-tags' }, tags.map(function (tag, index) {
                return h('span', { className: 'bw-tag', key: 't' + index }, tag);
              }))
            )
          )
        ),
        h('section', { className: 'bw-section' },
          h('div', { className: 'bw-eyebrow' }, 'BUD-WEL'),
          h('h2', null, get('news_title')),
          h('p', null, get('news_intro')),
          newsCards.length ? newsCards : h('p', null, 'Brak opublikowanych aktualności.')
        ),
        h('section', { className: 'bw-contact' },
          h('div', { className: 'bw-eyebrow' }, get('contact_eyebrow')),
          h('h2', null, get('contact_title')),
          h('p', null, get('contact_intro')),
          h('div', { className: 'bw-contact-meta' },
            h('b', null, get('company_name')),
            h('br'),
            get('company_services'),
            h('br'),
            get('service_area'),
            h('br'),
            'Tel. ', get('phone'),
            h('br'),
            get('email')
          )
        ),
        h('footer', { className: 'bw-footer' }, 'BUD-WEL · Piotr Czapliński')
      );
    }
  });

  // This is a file collection: register by the file name "tresci", not collection name "strona".
  window.CMS.registerPreviewTemplate('tresci', SitePreview);
})();
