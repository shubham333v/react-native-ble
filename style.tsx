import {StyleSheet, Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height;
const panelHeight=50;
const rxtxPanelHeight=40;
export const stylesGlob = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
    backgroundColor:"#333"
  },
  containerMain: {
    flex: 1
  },
  bottomView: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: "100%",
    width:"20%",
    alignItems: 'center'
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  }
});

export const stylesACtPanel=StyleSheet.create({
panel:{
  backgroundColor:"teal",
  flexDirection: "row",
  justifyContent: "space-around",
  height:panelHeight,
  marginTop:1
},button:{
  backgroundColor: '#fff',
  borderWidth: 0,
  color: '#FFFFFF',
  borderColor: 'red',
  height:panelHeight-10,
  top:5,
  width:"18%",
  alignItems: 'center',
  lineHeight:panelHeight,
  borderEndEndRadius:10,
  borderRadius: panelHeight,
  verticalAlign:"middle"
},

});

export const stylesConnPanel =StyleSheet.create({
dev:{
  color:"#fff",
  width:"60%",
  height:"100%",
  textAlign:"center",
  verticalAlign:"middle",
  lineHeight:panelHeight
},
panel:{
  flexDirection: "row",
  justifyContent: "space-around",
  height:panelHeight,
  marginTop:10
},
button:{
  backgroundColor: '#555',
  borderWidth: 0,
  color: '#FFFFFF',
  borderColor: 'red',
  height: "100%",
  width:"18%",
  alignItems: 'center',
  lineHeight:panelHeight,
  borderEndEndRadius:10,
  borderRadius: panelHeight,
  verticalAlign:"middle"
},
id:{
  color:"#fff",
},
name:{},
ico:{lineHeight:panelHeight,
paddingTop:15,
paddingLeft:15,
backgroundColor:"teal"}

});

export const stylesDevItems =StyleSheet.create({
  id:{
    color:"#fff"
  },
  name:{
    color:"#fff"
  }
});

export const stylesRxTxPan=StyleSheet.create({
button:{
  backgroundColor: '#555',
  borderWidth: 0,
  color: '#FFFFFF',
  borderColor: 'red',
  height: "100%",
  width:rxtxPanelHeight*2,
  alignItems: 'center',
  borderEndEndRadius:10,
  borderRadius:rxtxPanelHeight
},
panel:{
  flexDirection: "row",
  justifyContent: "space-around",
  height:rxtxPanelHeight,
  marginBottom:5,
  marginTop:5
},
label:{
width:150,
alignSelf:"flex-start",
color:"#fff"
},
vals:{
  width:150,
  color:"#fff"
},
invals:{
  width:150,
  backgroundColor:"#777"
}

});