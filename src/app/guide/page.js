import Link from 'next/link';
import GuideSearch from '../../components/GuideSearch';
import GuideFAQ from '../../components/GuideFAQ';

export default function GuidePage() {
	const searchItems = [
		{ name: 'Clean paper and cardboard', category: 'Recyclables', target: 'recyclables' },
		{ name: 'Plastic bottles and containers', category: 'Recyclables', target: 'recyclables' },
		{ name: 'Glass bottles and jars', category: 'Recyclables', target: 'recyclables' },
		{ name: 'Aluminum and steel cans', category: 'Recyclables', target: 'recyclables' },
		{ name: 'Newspapers and magazines', category: 'Recyclables', target: 'recyclables' },
		{ name: 'Fruit and vegetable scraps', category: 'Organic', target: 'organic' },
		{ name: 'Coffee grounds and tea bags', category: 'Organic', target: 'organic' },
		{ name: 'Eggshells', category: 'Organic', target: 'organic' },
		{ name: 'Garden trimmings', category: 'Organic', target: 'organic' },
		{ name: 'Leaves and grass clippings', category: 'Organic', target: 'organic' },
		{ name: 'Disposable diapers', category: 'General Waste', target: 'general' },
		{ name: 'Cigarette butts', category: 'General Waste', target: 'general' },
		{ name: 'Broken ceramics', category: 'General Waste', target: 'general' },
		{ name: 'Batteries', category: 'Hazardous', target: 'hazardous' },
		{ name: 'Electronics and e-waste', category: 'Hazardous', target: 'hazardous' },
		{ name: 'Paint and chemicals', category: 'Hazardous', target: 'hazardous' },
	];

	const faqs = [
		{ q: 'Can greasy pizza boxes be recycled?', a: 'Small grease stains on cardboard should be removed when possible. Large grease-soaked boxes should go to General Waste. Tear off clean parts for recycling.' },
		{ q: 'Do I need to rinse containers before recycling?', a: 'Yes — rinse bottles, jars, and cans to remove residue. They don\'t need to be spotless, but remove most food to avoid contamination.' },
		{ q: 'What about plastic bags and soft plastics?', a: 'Plastic bags and soft films typically are NOT accepted in curbside recycling. Use grocery-store bag drop-offs where available.' },
		{ q: 'How do I dispose of household batteries?', a: 'Batteries are hazardous — keep them separated and take them to designated drop-off locations or hazardous collection events.' },
		{ q: 'Can I compost meat and dairy at home?', a: 'Avoid composting large amounts of meat or dairy in small home systems — they attract pests. Use municipal organic programs if accepted.' },
	];
	return (
		<main className="container guide-page">
			<div className="guide-header slide-in header-row">
				<div className="guide-intro">
					<h1>Waste Segregation Guide</h1>
					<p className="muted">Learn how to properly sort and dispose of different types of waste</p>
				</div>

				{/* client-side search component (debounced + jump-to) */}
				<div className="search-box">
					<div className="search-box-inner">
						<GuideSearch items={searchItems} />
					</div>
				</div>
			</div>


			<section className="guide-cards">
				<a href="#recyclables" className="guide-card card fade-in">
					<div className="card-icon">♻️</div>
					<h3>Recyclables</h3>
					<p className="muted">Paper, plastic, glass, metal</p>
				</a>

				<a href="#organic" className="guide-card card fade-in">
					<div className="card-icon">🍃</div>
					<h3>Organic</h3>
					<p className="muted">Food scraps, garden waste</p>
				</a>

				<a href="#general" className="guide-card card">
					<div className="card-icon">⚠️</div>
					<h3>General Waste</h3>
					<p className="muted">Non-recyclable items</p>
				</a>

				<a href="#hazardous" className="guide-card card">
					<div className="card-icon">🚨</div>
					<h3>Hazardous</h3>
					<p className="muted">Batteries, chemicals, electronics</p>
				</a>
			</section>

			<section className="guide-detail-grid">
				<div className="guide-panel card fade-in" id="recyclables">
					<div className="panel-head">
						<div className="card-icon small">♻️</div>
						<h4>Recyclables</h4>
					</div>
					<p className="muted">Items that can be processed and reused</p>

					<div className="panel-columns">
						<div className="panel-col">
							<h5 className="accepted-heading">✔ Accepted Items</h5>
							<ul>
								<li>Clean paper and cardboard</li>
								<li>Plastic bottles and containers (1–7)</li>
								<li>Glass bottles and jars</li>
								<li>Aluminum and steel cans</li>
								<li>Newspapers and magazines</li>
							</ul>
						</div>

						<div className="panel-col">
							<h5 className="not-accepted">✖ Not Accepted</h5>
							<ul>
								<li>Dirty or greasy containers</li>
								<li>Plastic bags and wrap</li>
								<li>Broken glass</li>
								<li>Styrofoam</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="guide-panel card fade-in" id="organic">
					<div className="panel-head">
						<div className="card-icon small">🍃</div>
						<h4>Organic Waste</h4>
					</div>
					<p className="muted">Biodegradable materials for composting</p>

					<div className="panel-columns">
						<div className="panel-col">
							<h5 className="accepted-heading">✔ Accepted Items</h5>
							<ul>
								<li>Fruit and vegetable scraps</li>
								<li>Coffee grounds and tea bags</li>
								<li>Eggshells</li>
								<li>Garden trimmings</li>
								<li>Leaves and grass clippings</li>
							</ul>
						</div>

						<div className="panel-col">
							<h5 className="not-accepted">✖ Not Accepted</h5>
							<ul>
								<li>Meat and dairy products</li>
								<li>Oils and fats</li>
								<li>Pet waste</li>
								<li>Diseased plants</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="guide-panel card fade-in" id="general">
					<div className="panel-head">
						<div className="card-icon small">⚠️</div>
						<h4>General Waste</h4>
					</div>
					<p className="muted">Non-recyclable items for landfill</p>
					<h5 className="subhead">Common Items</h5>
					<ul>
						<li>Dirty packaging</li>
						<li>Disposable diapers</li>
						<li>Cigarette butts</li>
						<li>Broken ceramics</li>
						<li>Mixed material items</li>
					</ul>

					<div className="panel-tip">
						<strong>Tip:</strong> Try to minimize general waste by choosing reusable alternatives and properly sorting recyclables.
					</div>
				</div>

				<div className="guide-panel card fade-in" id="hazardous">
					<div className="panel-head">
						<div className="card-icon small">🚨</div>
						<h4>Hazardous Waste</h4>
					</div>
					<p className="muted">Special handling required</p>
					<h5 className="subhead warn">⚠ Special Collection Items</h5>
					<ul>
						<li>Batteries (all types)</li>
						<li>Electronics and e-waste</li>
						<li>Paint and chemicals</li>
						<li>Fluorescent bulbs</li>
						<li>Motor oil and filters</li>
					</ul>

					<div className="panel-important">
						<strong>Important:</strong> Never put hazardous waste in regular bins. Use designated drop-off locations or special collection events.
					</div>

					<div className="panel-cta">
						<Link href="/pickup" className="btn btn-light">Find Drop-off Locations</Link>
					</div>
				</div>
			</section>

			{/* FAQ accordion */}
			<div style={{marginTop:18}}>
				<GuideFAQ faqs={faqs} />
			</div>

			{/* small helper CTA if the user is still unsure */}
			<div className="still-unsure">
				<div className="su-left">
					<div className="icon">❓</div>
					<div>
						<strong>Still unsure what to do?</strong>
						<div className="muted">Open a quick report and our team will help classify the item.</div>
					</div>
				</div>
				<div className="su-cta">
					<Link href="/reports" className="btn btn-primary">Report item</Link>
				</div>
			</div>

			<section className="local-rules card local-rules--spaced">
				<h3>Local Collection Rules</h3>
				<p className="muted">Specific guidelines for your community</p>
				<div className="local-rules-grid">
					<div className="collection-schedule">
						<h4>Collection Schedule</h4>
						<div className="schedule-grid">
							<div>General Waste:</div>
							<div className="muted">Tuesdays &amp; Fridays</div>
							<div>Recyclables:</div>
							<div className="muted">Wednesdays</div>
							<div>Organic Waste:</div>
							<div className="muted">Mondays &amp; Thursdays</div>
							<div>Bulk Items:</div>
							<div className="muted">First Saturday of month</div>
						</div>
					</div>

					<div className="important-reminders">
						<h4>Important Reminders</h4>
						<ul>
							<li>Place bins out by 7:00 AM on collection day</li>
							<li>Keep lids closed to prevent spillage</li>
							<li>Clean containers before recycling</li>
							<li>Maximum weight: 50 lbs per bin</li>
							<li>Report missed collections within 24 hours</li>
						</ul>
					</div>
				</div>
			</section>
		</main>
	)
}

