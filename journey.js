document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.products').insertAdjacentHTML('afterend', `
    <section class="journey" id="journey"><div class="shell">
      <div class="journey-head"><div class="eyebrow">The Idukki journey</div><h2>From Kerala’s spice hills to your kitchen.</h2><p>Our pepper and cardamom are chosen for the bright, unmistakable character that comes from careful growing, patient handling, and thoughtful selection.</p></div>
      <div class="journey-grid">
        <article class="journey-step"><div class="journey-no">01</div><h3>Born in Kerala</h3><p>Both pepper and cardamom are sourced from Idukki’s cool, rain-fed spice hills, where shade, soil and climate shape their natural character.</p></article>
        <article class="journey-step"><div class="journey-no">02</div><h3>Picked at the Right Moment</h3><p>Harvesting is timed for mature berries and well-developed pods, helping preserve the aroma, colour and flavour each spice is known for.</p></article>
        <article class="journey-step"><div class="journey-no">03</div><h3>From Harvest to Purity</h3><p>Pepper is carefully cleaned and sorted; cardamom is gently dried to protect its green appearance and naturally sweet, refreshing aroma.</p></article>
        <article class="journey-step"><div class="journey-no">04</div><h3>Only the Best Make the Cut</h3><p>We select for clean appearance, size and consistency—offering bold and cleaned pepper, plus cardamom grades to suit different needs.</p></article>
        <article class="journey-step"><div class="journey-no">05</div><h3>Nature’s Signature Aroma</h3><p>Pepper develops its warm, citrusy heat in every berry; cardamom holds its cool, sweet fragrance inside each carefully formed pod.</p></article>
        <article class="journey-step"><div class="journey-no">06</div><h3>From Farm to Your Kitchen</h3><p>Handled with care from selection through packing, so the colour, aroma and flavour of Idukki arrive ready for your table.</p></article>
      </div>
    </div></section>`);
});
