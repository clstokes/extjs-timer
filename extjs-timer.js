
var timerEndFunction = function() {

    var btn = Ext.getCmp( 'btnStart');
    btn.setText( 'Start' );
    // console.log( "Timer end function executed." );

};

var timerRunFunction = function() {
    
    var form =  Ext.getCmp( 'formTimer' ).getForm();

    form.findField( "timerHours" ).setValue( timer.getHours() );
    form.findField( "timerMinutes" ).setValue( timer.getMinutes() );
    form.findField( "timerSeconds" ).setValue( timer.getSeconds() );

}

var timerFormPanel = new Ext.FormPanel( {
    id: 'formTimer',
    labelAlign: 'top',
    frame: true,
    border: true,
    labelWidth: 100,
    
    items: [ { 
        layout: 'column',
        items: [ {
            layout: 'form',
            items: [ {
                width: 30,
                xtype: 'textfield',
                fieldLabel: 'Hours', 
                labelSeparator: '',
                name: 'timerHours',
                id: 'timerHours',
                maskRe: /[0-9]/,
                emptyText: '0',
                anchor:'95%'
            } ]
        }, {
            layout: 'form',
            items: [ {
                width: 30,
                xtype: 'textfield',
                fieldLabel: 'Minutes', 
                labelSeparator: '',
                name: 'timerMinutes',
                maskRe: /[0-9]/,
                emptyText: '0',
                anchor:'95%'
            } ]
        }, {
            layout: 'form',
            items: [ {
                width: 30,
                xtype: 'textfield',
                fieldLabel: 'Seconds', 
                labelSeparator: '',
                name: 'timerSeconds',
                maskRe: /[0-9]/,
                emptyText: '0',
                anchor:'95%'
            } ]
        } ]
    } ],

    buttons: [
        { 
            id: 'btnStart',
            text: 'Start',
            handler: function() {
                var hours = timerFormPanel.getForm().findField( "timerHours" ).getValue();
                var minutes = timerFormPanel.getForm().findField( "timerMinutes" ).getValue();
                var seconds = timerFormPanel.getForm().findField( "timerSeconds" ).getValue();
                if ( !timer.isRunning() && ( hours > 0 || minutes > 0 || seconds > 0 ) ) {
                    timer.init( hours, minutes, seconds );
                    timer.setRunCallBack( timerRunFunction );
                    timer.setEndCallBack( this.resetText );
                    timer.start();
                    this.setText( 'Stop' );
                }
                else {
                    timer.stop();
                    this.setText( 'Start' );
                }
            },
            resetText: function() {
                var btn = Ext.getCmp( 'btnStart');
                btn.setText( 'Start' );
            }
        }, {
            text: 'Reset',
            handler: function() {
                timer.stop();
                timer.reset();
                timerFormPanel.getForm().findField( "timerHours" ).setValue( timer.getHours() );
                timerFormPanel.getForm().findField( "timerMinutes" ).setValue( timer.getMinutes() );
                timerFormPanel.getForm().findField( "timerSeconds" ).setValue( timer.getSeconds() );
            }
        }
    ]

} );

var timerWindow = new Ext.Window( {

        layout: 'auto',
        title: 'Timer',
        width: 200,
        closable: false,
        resizable: false,
        border: false,
        plain: true,
        constrain: true,
        constrainHeader: true,
        items: [ timerFormPanel ]

} );

var parseNumber = function( val, def ) {
    var defaultValue = ( def != undefined) ? def : 0;

    if ( isNaN( val ) || val == '' ) {
        return defaultValue;
    }

    return parseInt( val );
}

Ext.onReady( function() {

	timerWindow.show();

} );

var timer = {

    originalTimeInSeconds: 0,
    currentTimeInSeconds: 0,

    runCallBack: null,
    endCallBack: null,

    running: false,
    
    interval: 1000,
    
    init: function( hours, minutes, seconds ) {
        hours = parseNumber( hours );
        minutes = parseNumber( minutes );
        seconds = parseNumber( seconds );
        
        totalSeconds = this.calculateSeconds( hours, minutes, seconds );
        this.originalTimeInSeconds = totalSeconds;
        this.currentTimeInSeconds = this.originalTimeInSeconds;
        // console.log( "Timer initialized to [%s] seconds.", totalSeconds );
    },

    clear: function() {
        this.originalTimeInSeconds = 0;
        this.currentTimeInSeconds = 0;
    },

    reset: function() {
        this.currentTimeInSeconds = this.originalTimeInSeconds;
        // console.log( 'Timer reset.' );
    },
    
    run: function() {

        this.currentTimeInSeconds = this.currentTimeInSeconds - 1;

        // console.log( "Time now [%s] seconds.", this.currentTimeInSeconds );
        
        this.runCallBack( timer.getHours, timer.getMinutes(), timer.getSeconds() );
        
        if ( this.isFinished() ) {
            // console.log( "Timer ended." );
            this.stop();
            return;
        }

    },
    
    isFinished: function() {
        if ( this.currentTimeInSeconds <= 0 ) {
            return true;
        }

        return false;
    },
    
    getHours: function() {
        return parseInt( this.currentTimeInSeconds / 3600 );
    },
    
    getMinutes: function() {
        return parseInt( ( this.currentTimeInSeconds % 3600 ) / 60 );
    },
    
    getSeconds: function() {
        hours = this.getHours();
        minutes = this.getMinutes();
        return this.currentTimeInSeconds - ( hours * 3600 ) - ( minutes * 60 );
    },
    
    setRunCallBack: function( fn ) {
        this.runCallBack = fn;
    },

    setEndCallBack: function( fn ) {
        this.endCallBack = fn;
    },

    start: function() {
        Ext.TaskMgr.start( this );
        this.running = true;
        // console.log( 'Timer started.' );
    }, 
    
    stop: function() {
        if ( this.running ) {
            Ext.TaskMgr.stop( this );
            this.running = false;
            // console.log( 'Timer stopped.' );
            this.endCallBack();
        }
        else {
            // console.log( 'Timer isn\'t running.' );
        }
    },
    
    isRunning: function() {
        return this.running;
    },
    
    calculateSeconds: function( hours, minutes, seconds ) {
        return seconds + ( minutes * 60 ) + ( hours * 60 * 60 );
    }
    
};
