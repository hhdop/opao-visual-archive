const navItems = [
  { label: '作品库', href: '#home' },
  { label: '原图领取', href: '#archive' },
];

function Navbar() {
  return (
    <header className="site-nav">
      <a className="nav-brand" href="#home" aria-label="画画的 o 泡 Visual Archive">
        <span className="brand-title">画画的 o 泡</span>
        <span className="brand-subtitle">Visual Archive</span>
      </a>
      <nav className="nav-links" aria-label="主导航">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
