const contacts = [
  ['微信', 'your_wechat_here'],
  ['邮箱', 'your_email_here'],
  ['小红书', 'your_xiaohongshu_here'],
  ['抖音', 'your_douyin_here'],
  ['B站', 'your_bilibili_here'],
];

function Contact() {
  return (
    <footer className="contact-section scroll-reveal" id="contact" aria-labelledby="contact-title">
      <div className="container contact-layout">
        <div>
          <p className="section-label">Contact / Let’s Talk</p>
          <h2 id="contact-title">联系与约稿</h2>
          <p>
            如果你想定制一张属于自己的画，或想参考某个作品风格进行约稿，可以通过以下方式联系我。
          </p>
          <div className="contact-actions">
            <a className="button button-light" href="mailto:your_email_here">
              联系约稿
            </a>
            <a className="button button-line" href="#commission">
              查看价格参考
            </a>
          </div>
        </div>

        <address className="contact-list">
          {contacts.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </address>
      </div>
      <div className="container copyright">© 2026 画画的 o 泡 Visual Archive. All works reserved.</div>
    </footer>
  );
}

export default Contact;
