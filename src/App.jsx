import { useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { formatPrice, products } from './data/products'
import { StoreProvider, useStore } from './context/StoreContext'

const SHIPPING = 150

function Image({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`image-fallback ${className}`} role="img" aria-label={alt}>JAVERISA</div>
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
}

function Header() {
  const { count } = useStore()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="site-header"><div className="header-inner">
    <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    <Link className="wordmark" to="/" onClick={close}>JAVERISA</Link>
    <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation"><NavLink to="/shop" onClick={close}>Shop</NavLink><NavLink to="/find-your-vibe" onClick={close}>Find Your Vibe</NavLink><NavLink to="/about" onClick={close}>Our Story</NavLink></nav>
    <div className="header-actions"><Link className="account-link" to="/login" aria-label="Account">Account</Link><Link className="bag-link" to="/cart" aria-label={`Shopping bag, ${count} items`}>Bag <span className="bag-count">{count}</span></Link></div>
  </div></header>
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main">
    <div className="footer-brand"><Link className="wordmark wordmark-light" to="/">JAVERISA</Link><p>Wear your own story.<br />Find your style, your way.</p></div>
    <div className="footer-links"><div><span className="footer-label">EXPLORE</span><Link to="/shop">Shop all</Link><Link to="/find-your-vibe">Find your vibe</Link><Link to="/about">Our story</Link></div><div><span className="footer-label">WE’RE HERE</span><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
    <div className="footer-note"><span className="footer-label">A NOTE FROM US</span><p>Thoughtful pieces for the many ways of being you.</p></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} JAVERISA</span><span>Made for your own story.</span></div></footer>
}

function Layout({ children }) {
  return <><Header /><main>{children}</main><Footer /></>
}

function ProductCard({ product }) {
  return <article className="product-card">
    <Link className="product-image-link" to={`/product/${product.id}`} aria-label={`View ${product.name}`}><Image src={product.image} alt={product.alt} className="product-image" /><span className="product-tag">{product.category}</span></Link>
    <div className="product-card-copy"><div><h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3><p>{product.shortDescription}</p></div><span className="product-price">{formatPrice(product.price)}</span></div>
    <Link className="text-link card-link" to={`/product/${product.id}`}>VIEW DETAILS <span aria-hidden="true">↗</span></Link>
  </article>
}

function ProductGrid({ items }) {
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
}

function Home() {
  return <>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">A LITTLE MORE YOU</span><h1>Wear Your<br /><em>Own Story.</em></h1><p>Discover pieces that reflect your individuality.<br className="desktop-break" /> Find your style, your way.</p><div className="hero-actions"><Link className="button button-primary" to="/shop">Explore the collection</Link><Link className="button button-outline" to="/find-your-vibe">Find your vibe</Link></div><a className="scroll-cue" href="#collection">A considered collection <span aria-hidden="true">↓</span></a></div>
      <div className="hero-visual"><Image src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=90" alt="Woman in a tailored blue coat and layered outfit on a city street" className="hero-image" /><span className="hero-image-note">STYLE IS PERSONAL. ALWAYS.</span></div><span className="hero-side-note">NEW SEASON · 2025</span></section>
    <section className="intro-section section-wrap"><span className="eyebrow">CURATED FOR YOUR STYLE</span><h2>Fashion Beyond Trends</h2><p>Getting dressed should feel like coming home to yourself. Discover everyday essentials, thoughtful layers and those pieces that make an ordinary day feel entirely your own.</p></section>
    <section id="collection" className="collection-section section-wrap"><div className="section-heading"><div><span className="eyebrow">THE JAVERISA EDIT</span><h2>Pieces to make your own</h2></div><Link className="text-link desktop-only" to="/shop">VIEW THE COLLECTION <span aria-hidden="true">↗</span></Link></div><ProductGrid items={products.slice(0, 4)} /><Link className="button button-outline mobile-collection-link" to="/shop">View the collection</Link></section>
    <section className="story-band"><div className="story-image"><Image src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85" alt="A quiet moment of personal style" /></div><div className="story-copy"><span className="eyebrow">LESS ABOUT THE LABEL</span><h2>More about<br /><em>how it feels.</em></h2><p>We believe the best wardrobe is the one that tells your story. No rules to follow, no trends to chase. Just pieces that feel right, every time you reach for them.</p><Link className="text-link" to="/about">GET TO KNOW US <span aria-hidden="true">↗</span></Link></div></section>
    <section className="vibe-banner"><div><span className="eyebrow">YOUR STYLE, YOUR WAY</span><h2>Not sure where to start?</h2><p>A few little questions. A few pieces that feel like you.</p></div><Link className="button button-light" to="/find-your-vibe">Find your vibe <span aria-hidden="true">↗</span></Link></section>
  </>
}

function Shop() {
  const [category, setCategory] = useState('All pieces')
  const categories = ['All pieces', ...new Set(products.map((product) => product.category))]
  const visible = category === 'All pieces' ? products : products.filter((product) => product.category === category)
  return <section className="page-section section-wrap"><div className="page-heading"><span className="eyebrow">THE JAVERISA EDIT</span><h1>Find your next<br /><em>favourite thing.</em></h1><p>Thoughtful pieces to wear in your own way.</p></div><div className="filter-row" aria-label="Filter by category">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div><ProductGrid items={visible} /></section>
}

function ProductDetails() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)
  const { addToCart } = useStore()
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  if (!product) return <NotFound />
  const submit = () => {
    if (product.sizes.length && !size) { setError('Please select a size before adding this piece to your bag.'); return }
    setError('')
    addToCart(product.id, quantity, size)
  }
  return <section className="detail-section section-wrap"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span>{product.name}</span></div>
    <div className="detail-layout"><div className="detail-image"><Image src={product.image} alt={product.alt} /></div><div className="detail-copy"><span className="eyebrow">{product.category} · {product.color}</span><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.price)}</p><p className="detail-description">{product.description}</p>
      {product.sizes.length > 0 && <fieldset className="size-field"><legend>Choose a size</legend><div className="size-options">{product.sizes.map((item) => <button type="button" key={item} className={`size-option ${size === item ? 'selected' : ''}`} aria-pressed={size === item} onClick={() => { setSize(item); setError('') }}>{item}</button>)}</div></fieldset>}
      <div className="buy-row"><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(99, value + 1))}>+</button></div><button className="button button-primary add-button" onClick={submit}>Add to bag</button></div>
      {error && <p className="form-error" role="alert">{error}</p>}<div className="detail-note"><span>THOUGHTFULLY CHOSEN</span><p>Easy pieces, considered for the way you live and the way you feel.</p><span>COMPLIMENTARY DELIVERY</span><p>Free shipping on orders over ₹5,000. A flat ₹150 otherwise.</p></div></div></div>
    <div className="related-products"><div className="section-heading"><div><span className="eyebrow">A FEW MORE TO LOVE</span><h2>You might also like</h2></div></div><ProductGrid items={products.filter((item) => item.id !== product.id).slice(0, 3)} /></div>
  </section>
}

function Cart() {
  const { lines, subtotal, updateQuantity, removeFromCart } = useStore()
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : SHIPPING
  const quantityCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  return <section className="page-section section-wrap"><div className="simple-heading"><span className="eyebrow">YOUR JAVERISA EDIT</span><h1>Your bag</h1><p>{quantityCount} lovely {quantityCount === 1 ? 'piece' : 'pieces'}</p></div>
    {lines.length === 0 ? <div className="empty-state"><span className="empty-mark">J</span><h2>Nothing in your bag. Yet.</h2><p>There are a few pieces with your name on them.</p><Link className="button button-primary" to="/shop">Explore the collection</Link></div> : <div className="cart-layout">
      <div className="cart-lines">{lines.map(({ product, quantity, size, lineTotal }) => <article className="cart-line" key={`${product.id}:${size}`}><Link className="cart-thumb" to={`/product/${product.id}`}><Image src={product.image} alt={product.alt} /></Link><div className="cart-line-info"><span className="eyebrow">{product.category}</span><h2><Link to={`/product/${product.id}`}>{product.name}</Link></h2>{size && <p>Size: {size}</p>}<span className="cart-line-price">{formatPrice(product.price)}</span><button className="remove-link" onClick={() => removeFromCart(product.id, size)}>Remove</button></div><div className="cart-line-end"><div className="quantity-control"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => updateQuantity(product.id, size, quantity - 1)}>−</button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => updateQuantity(product.id, size, quantity + 1)}>+</button></div><strong>{formatPrice(lineTotal)}</strong></div></article>)}</div>
      <aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div><span>Delivery</span><span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span></div><p className="shipping-note">{subtotal >= 5000 ? 'Complimentary delivery is yours.' : `Complimentary delivery on orders over ${formatPrice(5000)}.`}</p><div className="summary-total"><span>Total</span><strong>{formatPrice(subtotal + shipping)}</strong></div><Link className="button button-primary button-full" to="/checkout">Continue to checkout</Link><Link className="continue-link" to="/shop">Continue exploring</Link><p className="demo-note">Demo store · no real payment is collected.</p></aside>
    </div>}
  </section>
}

function Checkout() {
  const { lines, subtotal, clearCart } = useStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const shipping = subtotal >= 5000 ? 0 : SHIPPING
  if (!lines.length) return <section className="page-section section-wrap"><div className="empty-state"><h1>Your bag is waiting</h1><p>Add something lovely before checking out.</p><Link className="button button-primary" to="/shop">Explore the collection</Link></div></section>
  const submit = (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const form = new FormData(event.currentTarget)
      const orderNumber = `JV-${Date.now().toString().slice(-8)}`
      const order = {
        id: orderNumber,
        customer: { name: form.get('name'), email: form.get('email'), phone: form.get('phone') },
        address: { line: form.get('address'), city: form.get('city'), state: form.get('state'), pin: form.get('pin') },
        items: lines.map(({ product, quantity, size, lineTotal }) => ({ id: product.id, name: product.name, image: product.image, quantity, size, price: product.price, lineTotal })),
        subtotal, shipping, total: subtotal + shipping, payment: 'Cash on delivery · demo order', status: 'Confirmed · demo order', createdAt: new Date().toISOString(),
      }
      const savedOrders = JSON.parse(localStorage.getItem('javerisa-orders-v1') || '[]')
      if (!Array.isArray(savedOrders)) throw new Error('Saved order data could not be read.')
      localStorage.setItem('javerisa-orders-v1', JSON.stringify([...savedOrders, order]))
      clearCart()
      navigate(`/order-confirmation/${orderNumber}`, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Your order could not be saved. Please try again.')
      setSubmitting(false)
    }
  }
  return <section className="page-section section-wrap"><div className="simple-heading"><span className="eyebrow">A FEW DETAILS</span><h1>Nearly yours.</h1><p>Complete your details to place this demo order.</p></div>
    <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><h2>Delivery details</h2><div className="form-grid">
      <label className="field full-field">Full name<input name="name" autoComplete="name" required maxLength="100" /></label><label className="field">Email address<input name="email" type="email" autoComplete="email" required maxLength="254" /></label><label className="field">Phone number<input name="phone" type="tel" autoComplete="tel" required minLength="10" maxLength="10" pattern="[0-9]{10}" inputMode="numeric" /></label><label className="field full-field">Address<input name="address" autoComplete="street-address" required maxLength="160" /></label><label className="field">City<input name="city" autoComplete="address-level2" required maxLength="80" /></label><label className="field">State<input name="state" autoComplete="address-level1" required maxLength="80" /></label><label className="field">PIN code<input name="pin" autoComplete="postal-code" required pattern="[0-9]{6}" maxLength="6" inputMode="numeric" /></label>
    </div><div className="payment-demo"><span className="eyebrow">PAYMENT</span><p><strong>Cash on delivery · demo</strong><br />No payment details are collected. This demo checkout does not process real payments.</p></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={submitting}>{submitting ? 'Placing order…' : 'Place demo order'}</button></form>
      <aside className="order-summary checkout-summary"><h2>Your pieces</h2>{lines.map(({ product, quantity, size, lineTotal }) => <div className="summary-product" key={`${product.id}:${size}`}><span>{product.name}{size ? ` · ${size}` : ''} × {quantity}</span><span>{formatPrice(lineTotal)}</span></div>)}<div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div><span>Delivery</span><span>{shipping ? formatPrice(shipping) : 'Complimentary'}</span></div><div className="summary-total"><span>Total</span><strong>{formatPrice(subtotal + shipping)}</strong></div></aside>
    </div>
  </section>
}

function OrderConfirmation() {
  const { id } = useParams()
  let order
  try { const orders = JSON.parse(localStorage.getItem('javerisa-orders-v1') || '[]'); order = Array.isArray(orders) ? orders.find((item) => item.id === id) : undefined } catch { order = undefined }
  if (!order) return <section className="page-section section-wrap"><div className="empty-state"><span className="eyebrow">ORDER NOT FOUND</span><h1>We can’t find that order.</h1><p>Order details are only available in the browser where the demo order was placed.</p><Link className="button button-primary" to="/shop">Continue shopping</Link></div></section>
  return <section className="page-section section-wrap"><div className="confirmation-card"><span className="success-mark" aria-hidden="true">✓</span><span className="eyebrow">THANK YOU, {order.customer.name.toUpperCase()}</span><h1>Your story, in the making.</h1><p>Your demo order has been saved. We’re glad these pieces found you.</p><div className="confirmation-number"><span>ORDER NUMBER</span><strong>{order.id}</strong><span>{order.status}</span></div><div className="confirmation-items">{order.items.map((item) => <div key={item.id + item.size}><span>{item.name}{item.size ? ` · ${item.size}` : ''} × {item.quantity}</span><strong>{formatPrice(item.lineTotal)}</strong></div>)}<div className="confirmation-total"><span>Total including delivery</span><strong>{formatPrice(order.total)}</strong></div></div><p className="demo-note">This is a locally saved demo order. No real payment or shipping has been arranged.</p><Link className="button button-primary" to="/shop">Continue exploring</Link></div></section>
}

const quizQuestions = [
  { id: 'style', title: 'Which style feels most like you?', options: ['Minimal and timeless', 'Casual and comfortable', 'Bold and expressive', 'Elegant and feminine'] },
  { id: 'pieces', title: 'What are you drawn to?', options: ['T-shirts and essentials', 'Sweatshirts and layers', 'Denim and trousers', 'Dresses and statement pieces', 'Shoes and accessories'] },
  { id: 'occasion', title: 'What are you dressing for?', options: ['Everyday wear', 'College or work', 'A special occasion', 'A weekend outing'] },
]

function FindYourVibe() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const recommended = useMemo(() => {
    const category = { 'T-shirts and essentials': 'Essentials', 'Sweatshirts and layers': 'Layers', 'Denim and trousers': 'Denim', 'Dresses and statement pieces': 'Dresses', 'Shoes and accessories': 'Accessories' }[answers.pieces]
    const byCategory = category ? products.filter((product) => product.category === category) : []
    const byStyle = answers.style ? products.filter((product) => product.vibe.includes(answers.style)) : []
    return [...new Set([...byCategory, ...byStyle])].slice(0, 3)
  }, [answers])
  const submit = (event) => { event.preventDefault(); if (quizQuestions.every((question) => answers[question.id])) setSubmitted(true) }
  return <section className="page-section section-wrap quiz-page"><div className="page-heading"><span className="eyebrow">A LITTLE MORE YOU</span><h1>Find Your Vibe.</h1><p>Your style, your way. Answer a few quick questions to discover pieces that feel like you.</p></div>
    <form className="quiz-form" onSubmit={submit}>{quizQuestions.map((question, index) => <fieldset className="quiz-question" key={question.id}><legend><span>0{index + 1}</span>{question.title}</legend><div className="quiz-options">{question.options.map((option) => <label key={option} className={`quiz-option ${answers[question.id] === option ? 'selected' : ''}`}><input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => { setAnswers((current) => ({ ...current, [question.id]: option })); setSubmitted(false) }} required /><span>{option}</span></label>)}</div></fieldset>)}<button className="button button-primary" type="submit">Show me my pieces <span aria-hidden="true">↗</span></button></form>
    {submitted && <section className="quiz-results" aria-live="polite"><span className="eyebrow">A FEW PIECES THAT FEEL LIKE YOU</span><h2>Your style, beautifully considered.</h2>{recommended.length ? <ProductGrid items={recommended} /> : <p>We’re still curating your perfect match. Take a look at the full collection.</p>}<Link className="text-link" to="/shop">EXPLORE ALL PIECES <span aria-hidden="true">↗</span></Link></section>}
  </section>
}

function DemoAuth({ mode }) {
  const isRegister = mode === 'register'
  const isReset = mode === 'reset'
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (isRegister && form.get('password') !== form.get('confirmPassword')) { setMessage('Those passwords don’t match. Please check and try again.'); return }
    setMessage(isReset ? 'Password recovery is not available in this demo. No email was sent.' : 'Account services are not connected in this demo, so no account was created and no password was stored.')
  }
  return <section className="auth-page section-wrap"><div className="auth-card"><span className="eyebrow">{isReset ? 'A FRESH START' : 'WELCOME TO JAVERISA'}</span><h1>{isReset ? 'Reset your password.' : isRegister ? 'Make yourself at home.' : 'Good to have you here.'}</h1><p>{isReset ? 'Enter your email and we’ll help you find your way back.' : isRegister ? 'Create an account for a more personal shopping experience.' : 'Sign in to your account and pick up where you left off.'}</p><div className="demo-alert"><strong>Demo mode</strong> · Secure account services aren’t configured. These forms validate your input but will not create an account or sign you in.</div>
    <form className="auth-form" onSubmit={submit}>{isRegister && <label className="field">Full name<input name="name" autoComplete="name" required maxLength="100" /></label>}<label className="field">Email address<input name="email" type="email" autoComplete="email" required maxLength="254" /></label>
      {!isReset && <label className="field">Password<div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} minLength="8" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></div></label>}
      {isRegister && <label className="field">Confirm password<input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="8" required /></label>}
      {!isRegister && !isReset && <div className="auth-extras"><label className="check-label"><input type="checkbox" name="remember" /> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>}
      <button className="button button-primary button-full" type="submit">{isReset ? 'Request password help' : isRegister ? 'Create account' : 'Sign in'}</button>{message && <p className="form-message" role="status">{message}</p>}</form>
    {!isReset && <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to JAVERISA?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>}{isReset && <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>}</div></section>
}

function StoryPage({ page }) {
  const content = {
    about: { label: 'A NOTE ON STYLE', title: 'The story is yours.', body: 'JAVERISA is built on a simple thought: the most interesting thing you can wear is yourself. We bring together considered everyday pieces and timeless favourites so getting dressed feels less like keeping up, and more like coming home.', second: 'We’re an independent fashion concept in demo form today. Our collection is a starting point for a wardrobe shaped by your own point of view.' },
    contact: { label: 'WE’RE HERE', title: 'Say hello.', body: 'Questions about a piece, a fit, or just want to tell us what you think? We’d love to hear from you.', second: 'Email: hello@javerisa.example · This is a placeholder contact address; no inbox is connected in this demo.' },
    privacy: { label: 'THE IMPORTANT DETAILS', title: 'Privacy, plainly.', body: 'This demo stores shopping bag contents and locally placed demo orders in your browser’s local storage. The account and payment forms do not send or store your credentials or payment details.', second: 'No analytics, account backend, email service, or payment provider is configured. Clear this site’s browser storage to remove locally saved demo data.' },
    terms: { label: 'THE IMPORTANT DETAILS', title: 'A few ground rules.', body: 'JAVERISA is a demonstration storefront. Product descriptions and prices are illustrative; checkout creates only a local demo order and does not take payment, arrange delivery, or create a binding purchase.', second: 'A production store would need verified product information, customer support, shipping terms, a secure order service, and a configured payment provider.' },
  }[page]
  return <section className="story-page section-wrap"><span className="eyebrow">{content.label}</span><h1>{content.title}</h1><p>{content.body}</p><p>{content.second}</p>{page === 'contact' && <Link className="button button-primary" to="/shop">Explore the collection</Link>}</section>
}

function NotFound() {
  return <section className="empty-state not-found"><span className="eyebrow">NOT QUITE HERE</span><h1>That page wandered off.</h1><p>Let’s find you something lovely instead.</p><Link className="button button-primary" to="/">Back to the beginning</Link></section>
}

function AppContent() {
  return <Layout><Routes>
    <Route path="/" element={<Home />} /><Route path="/shop" element={<Shop />} /><Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/login" element={<DemoAuth mode="login" />} /><Route path="/register" element={<DemoAuth mode="register" />} /><Route path="/forgot-password" element={<DemoAuth mode="reset" />} />
    <Route path="/cart" element={<Cart />} /><Route path="/checkout" element={<Checkout />} /><Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
    <Route path="/find-your-vibe" element={<FindYourVibe />} /><Route path="/about" element={<StoryPage page="about" />} /><Route path="/contact" element={<StoryPage page="contact" />} /><Route path="/privacy" element={<StoryPage page="privacy" />} /><Route path="/terms" element={<StoryPage page="terms" />} /><Route path="*" element={<NotFound />} />
  </Routes></Layout>
}

export default function App() {
  return <StoreProvider><AppContent /></StoreProvider>
}