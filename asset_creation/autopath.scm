(define (script-fu-auto-path img)

	(let* (   
            (nroflayers 0)
            (layernames '())
            
            (index1 0)
			(index2 0)
      (colorselected 0)
			(fname "test.svg")
		)

    (gimp-context-push)

    (gimp-undo-push-group-start img)

    (set! nroflayers (car (gimp-image-get-layers img)))
    (set! layernames (cadr (gimp-image-get-layers img)))
	
	(while (< index2 nroflayers)

		(gimp-item-set-visible (aref layernames index2) FALSE)

    (set! index2 (+ 1 index2)))
	
    (while (< index1 nroflayers)
	
		(gimp-item-set-visible (aref layernames index1) TRUE)
		(gimp-image-set-active-layer img (aref layernames index1))
		(gimp-image-select-color 
                                img
                                CHANNEL-OP-REPLACE
                                (aref layernames index1)
                                (car (gimp-color-picker img (aref layernames index1) 5.0 665.0 FALSE FALSE 1))
                                )
		;(gimp-fuzzy-select-full (aref layernames index1) 1.0 1.0 0.0 CHANNEL-OP-REPLACE TRUE FALSE 0.0 0.0 TRUE TRUE 0)
		(gimp-selection-invert img)
		(plug-in-sel2path 1 img (aref layernames index1))
		(gimp-item-set-visible (aref layernames index1) FALSE)

    (set! index1 (+ 1 index1)))

    (gimp-undo-push-group-end img)

    (gimp-displays-flush)
	

	(define fname (car (strbreakup (car (gimp-image-get-filename img)) ".")))
	(set! fname (string-append fname ".svg"))
	(gimp-vectors-export-to-file img fname 0)

    (gimp-context-pop)))
	

(define (script-fu-auto-path-all-images)
              
	(define index3 0)

    (define nrofimgs (car (gimp-image-list)))
    (define imgnames (cadr (gimp-image-list)))
	(define nroflayers 0)
    (define layernames '())
    (define index1 0)
    (define index2 0)
    (define fname "test.svg")
    (define colorselected 0)
	
	(while (< index3 nrofimgs)

		(gimp-context-push)

		; for 4 players at top (old res 1244 1024) (gimp-image-resize (aref imgnames index3) 1240 670 -2 -177)
    ; for 5 players at top (like with sheik) (new res 1312 1080)
    (gimp-image-resize (aref imgnames index3) 1240 646 -36 -217)
		; for puff (gimp-image-resize (aref imgnames index3) 1240 1020 -2 -2)
		(define nroflayers (car (gimp-image-get-layers (aref imgnames index3))))
		(define layernames (cadr (gimp-image-get-layers (aref imgnames index3))))
		(define index1 0)
		(define index2 0)
		
		(while (< index2 nroflayers)

			(gimp-item-set-visible (aref layernames index2) FALSE)

		(set! index2 (+ 1 index2)))
		
		(while (< index1 nroflayers)
			(gimp-item-set-visible (aref layernames index1) TRUE)
			(gimp-image-set-active-layer (aref imgnames index3) (aref layernames index1))
			            (gimp-image-select-color 
                                (aref imgnames index3)
                                CHANNEL-OP-REPLACE
                                (aref layernames index1)
                                (car (gimp-color-picker (aref imgnames index3) (aref layernames index1) 5.0 665.0 FALSE FALSE 1))
                                )
			;(gimp-fuzzy-select-full (aref layernames index1) 1.0 1.0 0.0 CHANNEL-OP-REPLACE TRUE FALSE 0.0 0.0 TRUE TRUE 0)
			(gimp-selection-invert (aref imgnames index3))
			(plug-in-sel2path 1 (aref imgnames index3) (aref layernames index1))
			(gimp-item-set-visible (aref layernames index1) FALSE)

		(set! index1 (+ 1 index1)))
		
		(define fname (car (strbreakup (car (gimp-image-get-filename (aref imgnames index3))) ".")))
		(set! fname (string-append fname ".svg"))
		
		(gimp-vectors-export-to-file (aref imgnames index3) fname 0)

		(gimp-context-pop)

    (set! index3 (+ 1 index3)))

   )


(define (script-fu-auto-path-all-images-keep-size)
              
	(define index3 0)

    (define nrofimgs (car (gimp-image-list)))
    (define imgnames (cadr (gimp-image-list)))
	(define nroflayers 0)
    (define layernames '())
    (define index1 0)
    (define index2 0)
    (define fname "test.svg")
	
	(while (< index3 nrofimgs)

		(gimp-context-push)

		;(gimp-image-resize (aref imgnames index3) 1240 670 -2 -177)
		(define nroflayers (car (gimp-image-get-layers (aref imgnames index3))))
		(define layernames (cadr (gimp-image-get-layers (aref imgnames index3))))
		(define index1 0)
		(define index2 0)
		
		(while (< index2 nroflayers)

			(gimp-item-set-visible (aref layernames index2) FALSE)

		(set! index2 (+ 1 index2)))
		
		(while (< index1 nroflayers)
		
			(gimp-item-set-visible (aref layernames index1) TRUE)
			(gimp-image-set-active-layer (aref imgnames index3) (aref layernames index1))
			            (gimp-image-select-color 
                                (aref imgnames index3)
                                CHANNEL-OP-REPLACE
                                (aref layernames index1)
                                '(0 255 0)
                                )
			;(gimp-fuzzy-select-full (aref layernames index1) 1.0 1.0 0.0 CHANNEL-OP-REPLACE TRUE FALSE 0.0 0.0 TRUE TRUE 0)
			(gimp-selection-invert (aref imgnames index3))
			(plug-in-sel2path 1 (aref imgnames index3) (aref layernames index1))
			(gimp-item-set-visible (aref layernames index1) FALSE)

		(set! index1 (+ 1 index1)))
		
		(define fname (car (strbreakup (car (gimp-image-get-filename (aref imgnames index3))) ".")))
		(set! fname (string-append fname ".svg"))
		
		(gimp-vectors-export-to-file (aref imgnames index3) fname 0)

		(gimp-context-pop)

    (set! index3 (+ 1 index3)))

   )

(define (script-fu-prepare-for-spritesheet img)

	(let* (   
            (nroflayers 0)
            (layernames '())
            
            (index1 0)
			(index2 0)
			(fname "test.svg")
		)

    (gimp-context-push)

    (gimp-undo-push-group-start img)

    (set! nroflayers (car (gimp-image-get-layers img)))
    (set! layernames (cadr (gimp-image-get-layers img)))
	
	(while (< index2 nroflayers)

		(gimp-item-set-visible (aref layernames index2) FALSE)

    (set! index2 (+ 1 index2)))
	
    (while (< index1 nroflayers)
	
		(gimp-item-set-visible (aref layernames index1) TRUE)
		(gimp-image-set-active-layer img (aref layernames index1))
		(gimp-image-select-color 
                                img
                                CHANNEL-OP-REPLACE
                                (aref layernames index1)
                                '(0 255 0)
                                )
		;(gimp-fuzzy-select-full (aref layernames index1) 1.0 1.0 0.0 CHANNEL-OP-REPLACE TRUE FALSE 0.0 0.0 TRUE TRUE 0)
		(gimp-selection-invert img)
		(gimp-item-set-visible (aref layernames index1) FALSE)

    (set! index1 (+ 1 index1)))

    (gimp-undo-push-group-end img)

    (gimp-displays-flush)
	

	(define fname (car (strbreakup (car (gimp-image-get-filename img)) ".")))
	(set! fname (string-append fname ".svg"))
	(gimp-vectors-export-to-file img fname 0)

    (gimp-context-pop)))

(script-fu-register "script-fu-auto-path"                 
					"<Image>/Select/Auto path"
                    "Automatically path all layers"
                    "schmoo"
                    "schmoo"
					"Sept 2016"
					"RGB*, GRAY* INDEXED*"
					SF-IMAGE "Image" 0
)

(script-fu-register "script-fu-auto-path-all-images"                 
					"<Image>/Select/Auto path All images"
                    "Automatically path all layers of all images"
                    "schmoo"
                    "schmoo"
					"Sept 2016"
					"RGB*, GRAY* INDEXED*"
)

(script-fu-register "script-fu-auto-path-all-images-keep-size"                 
					"<Image>/Select/Auto path All images Keep size"
                    "Automatically path all layers of all images and keeps size"
                    "schmoo"
                    "schmoo"
					"Sept 2016"
					"RGB*, GRAY* INDEXED*"
)

(script-fu-register "script-fu-prepare-for-spritesheet"                 
					"<Image>/Select/Prepare for spritesheet"
                    "Automatically trim layers and cut out character"
                    "schmoo"
                    "schmoo"
					"Sept 2016"
					"RGB*, GRAY* INDEXED*"
					SF-IMAGE "Image" 0
)
