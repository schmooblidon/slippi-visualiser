export function setupControlsBox() {
  $( "#controls" )
  .mouseover(function() {
    $( this ).css('opacity', '0.9');
  })
  .mouseout(function() {
    $( this ).css('opacity', '0.15');
  });
}