/**
 * External Dependencies
 */
 import classnames from 'classnames';

 /**
  * WordPress Dependencies
  */
 const { __ } = wp.i18n;
 const { addFilter } = wp.hooks;
 const { Fragment }	= wp.element;
 const { InspectorControls }	= wp.blockEditor;
 const { createHigherOrderComponent } = wp.compose;
 import { Panel, PanelBody, PanelRow, __experimentalNumberControl as NumberControl, __experimentalText as Text, __experimentalDivider as Divider } from '@wordpress/components';
 const { ToggleControl } = wp.components;
 
 //restrict to specific block names
 const allowedBlocks = [ 'core/image' ];
 
 /**
  * Add custom attribute for mobile visibility.
  *
  * @param {Object} settings Settings for the block.
  *
  * @return {Object} settings Modified settings.
  */
 function addAttributes( settings ) {
     
    //check if object exists for old Gutenberg version compatibility
    //add allowedBlocks restriction
    if( allowedBlocks.includes( settings.name ) ){
     
        const { attributes } = settings;
        return {
            ...settings,
            attributes: {
                ...attributes,
                activateParallax:{ 
                    type: 'boolean',
                    default: false,
                },
                parallaxLayer:{
                    type: 'number',
                    default: 0
                },
                parallaxDirection:{ 
                    type: 'boolean',
                    default: false,
                }
            }
        }      
    }
    return settings;
 }
 
 /**
  * Add mobile visibility controls on Advanced Block Panel.
  *
  * @param {function} BlockEdit Block edit component.
  *
  * @return {function} BlockEdit Modified block edit component.
  */
 const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
     return ( props ) => {
        const {
            name,
            attributes,
            setAttributes,
            isSelected,
        } = props;
 
        const {
            activateParallax,
            parallaxLayer,
            parallaxDirection
         } = attributes;
         
         
         return (
             <Fragment>
                 <BlockEdit {...props} />
                 { isSelected && allowedBlocks.includes( name ) &&
                     <InspectorControls>
                        <Panel>
                            <PanelBody title="Parallax-Einstellungen" initialOpen={ true }>
                                <PanelRow>
                                    <ToggleControl
                                            label={ !! activateParallax ? __( 'Parallax aktiv' ) : __( 'Parallax inaktiv' ) }
                                            checked={ !! activateParallax }
                                            onChange={ () => setAttributes( {  activateParallax: ! activateParallax } ) }
                                        />
                                </PanelRow>
                                {
                                    !! activateParallax &&
                                    <Fragment>
                                        <Divider />
                                        <PanelRow>
                                            <Text>Layer-Position: je höher die eingegebene Nummer ist, desto schneller bewegt sich das Bild. 0 bedeutet keine Bewegung.</Text>
                                        </PanelRow>
                                        <PanelRow>
                                            <NumberControl 
                                                onChange = { e => setAttributes( {  parallaxLayer: parseInt(e) } ) }
                                                value = { parallaxLayer }
                                                min = "0"
                                                max = "5"
                                            />
                                        </PanelRow>
                                        <Divider />
                                        <PanelRow>
                                            <Text>Soll sich das Bild gegen die Scrollrichtung oder mit der Scrollrichtung bewegen?</Text>
                                        </PanelRow>
                                        <PanelRow>
                                            <ToggleControl
                                                    label={ !! parallaxDirection ? __( 'mit der Scrollrichtung' ) : __( 'gegen die Scrollrichtung' ) }
                                                    checked={ !! parallaxDirection }
                                                    onChange={ () => setAttributes( {  parallaxDirection: ! parallaxDirection } ) }
                                                />
                                        </PanelRow>
                                    </Fragment>
                                }
                            </PanelBody>
                        </Panel>
                     </InspectorControls>
                 }
 
             </Fragment>
         );
     };
 }, 'withInspectorControls');
 
 /**
  * Add custom element class in save element.
  *
  * @param {Object} extraProps     Block element.
  * @param {Object} blockType      Blocks object.
  * @param {Object} attributes     Blocks attributes.
  *
  * @return {Object} extraProps Modified block element.
  */
 function applyExtraClass( extraProps, blockType, attributes ) {
 
     const { 
        activateParallax,
        parallaxLayer,
        parallaxDirection
      } = attributes;
     
     //check if attribute exists for old Gutenberg version compatibility
     //add class only when visibleOnMobile = false
     //add allowedBlocks restriction
    if ( typeof activateParallax !== 'undefined' && activateParallax && allowedBlocks.includes( blockType.name ) ) {
        extraProps.className = classnames( extraProps.className, 'has-image-parallax' );
    }

    if ( typeof parallaxDirection !== 'undefined' && parallaxDirection && allowedBlocks.includes( blockType.name ) ) {
        extraProps['data-direction'] = 'with';
    }

    if ( typeof parallaxLayer !== 'undefined' && allowedBlocks.includes( blockType.name ) ) {
        extraProps['data-layer'] = parallaxLayer;
    }
 
    return extraProps;
 }
 
 //add filters
 
 addFilter(
     'blocks.registerBlockType',
     'huishu/parallax-addition',
     addAttributes
 );
 
 addFilter(
     'editor.BlockEdit',
     'huishu/parallax-addition',
     withInspectorControls
 );
 
 addFilter(
     'blocks.getSaveContent.extraProps',
     'huishu/parallax-addition',
     applyExtraClass
 );