import _ from "lodash";
import Pako from "pako";

export function numberFormatter(num) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "B" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "Q" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return Math.abs(num) >= item.value;
    });
    return item ? (num / item.value).toFixed(2).replace(rx, "$1") + item.symbol : "0";
}

export const handleColorChange = (livedata, preRef) => {
    // console.log("preRef.current.innerHTML",preRef.current.innerHTML)
    if (livedata) {
        // const num = document.getElementById('number').innerHTML
        // console.log("first",preRef.current.innerHTML)
        if (parseFloat(livedata) > parseFloat(preRef.current.innerHTML)) {
            preRef.current.style.color = '#00e396'
        }
        if (parseFloat(livedata) < parseFloat(preRef.current)) {
            preRef.current.style.color = 'red'
        }
    }
}
export const isNullOrUndefined = (value) => value === null || value === undefined;

export function numberWithCommas(x) {
    if (0 > parseFloat(x) && parseFloat(x) > -1000) {
        return x
    }
    else {

        x = String(x).toString();
        var afterPoint = '';
        if (x.indexOf('.') > 0)
            afterPoint = x.substring(x.indexOf('.'), x.length);
        if (x > 0)
            x = Math.floor(x);
        else
            x = Math.ceil(x);

        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    }

}

export function maskIt(str, pad = str.length - 2) {
    return str.slice(0, pad * -1).padEnd(str.length, '*');
}


export function timeAgo(input) {
    const date = (input instanceof Date) ? input : new Date(input);
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    var num = secondsElapsed;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hour(s) and " + rminutes + " minute(s).";
}

export const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function compressImage(imgToCompress, resizingFactor = 0.3, quality = 0.3) {
    imgToCompress = fileToDataUri(imgToCompress)
    // showing the compressed image
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const originalWidth = imgToCompress.width;
    const originalHeight = imgToCompress.height;

    const canvasWidth = originalWidth * resizingFactor;
    const canvasHeight = originalHeight * resizingFactor;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.drawImage(
        imgToCompress,
        0,
        0,
        originalWidth * resizingFactor,
        originalHeight * resizingFactor
    );

    // reducing the quality of the image
    canvas.toBlob(
        (blob) => {
            if (blob) {
                console.log(bytesToSize(blob.size));
            }
        },
        "image/jpeg",
        quality
    );
}

export function bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes === 0) {
        return "0 Byte";
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export function fileToDataUri(field) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            resolve(reader.result);
        });
        reader.readAsDataURL(field);
    });
}


export function createNetPosition(socketnetposition, broadcast, netposition) {
    let FinalNetposition = []
    if (netposition != undefined) {

        FinalNetposition = JSON.parse(JSON.stringify(netposition))
    }
    if (socketnetposition) {
        if (FinalNetposition.length === 0) {
            FinalNetposition = socketnetposition
        }
        else {
            for (let j = 0; j < socketnetposition.length; j++) {
                let isExist = false
                for (let i = 0; i < FinalNetposition.length; i++) {
                    if (FinalNetposition[i]['scripcode'] == socketnetposition[j]['scripcode'] && FinalNetposition[i]['userid'] == socketnetposition[j]['userid']) {
                        FinalNetposition[i]['buyqty'] = socketnetposition[j]['buyqty']
                        FinalNetposition[i]['sellqty'] = socketnetposition[j]['sellqty']
                        FinalNetposition[i]['netqty'] = socketnetposition[j]['netqty']
                        FinalNetposition[i]['cfqty'] = socketnetposition[j]['cfqty']
                        FinalNetposition[i]['cfamt'] = socketnetposition[j]['cfamt']
                        FinalNetposition[i]['brokerageamt'] = socketnetposition[j]['brokerageamt']
                        isExist = true
                    }
                }
                if (!isExist) {
                    FinalNetposition.push(socketnetposition[j])
                    isExist = true
                }
            }
        }

        if (broadcast.length > 0) {
            for (let i = 0; i < FinalNetposition.length; i++) {
                for (let j = 0; j < broadcast.length; j++) {
                    if (FinalNetposition[i]['scripcode'] == broadcast[j]['scripcode']) {
                        FinalNetposition[i]['ltp'] = broadcast[j]['ltp']
                        FinalNetposition[i]['grossmtm'] = FinalNetposition[i]['cfamt'] + (broadcast[j]['ltp'] * FinalNetposition[i]['cfqty'] * FinalNetposition[i]['multiplier'])
                        FinalNetposition[i]['netmtm'] = FinalNetposition[i]['grossmtm'] - FinalNetposition[i]['brokerageamt']
                        FinalNetposition[i]['clientmtm'] = FinalNetposition[i]['netmtm'] * (FinalNetposition[i]['clientsharing'] / 100)
                        FinalNetposition[i]['brokmtm'] = FinalNetposition[i]['netmtm'] * (FinalNetposition[i]['broksharing'] / 100)
                        FinalNetposition[i]['compmtm'] = FinalNetposition[i]['netmtm'] * (FinalNetposition[i]['comsharing'] / 100)

                    }
                }
            }
        }

        return FinalNetposition;
    }
}

export function createDataSummary(netposition, datasummary, usdrate) {
    let Groupdata = []
    // console.log(netposition, datasummary, usdrate);
    if (netposition !== undefined) {
        if (netposition.length > 0) {

            Groupdata = JSON.parse(JSON.stringify(netposition));

            Groupdata = Groupdata.filter((val) => {
                val.currency == 'USD' ? val.arbtodaymtm = val.netmtm * (val.usdrate == 1 ? usdrate : val.usdrate) : val.arbtodaymtm = val.netmtm
                val.currency == 'USD' ? val.client_arbtodaymtm = val.netmtm * (val.usdrate == 1 ? usdrate : val.usdrate) * (val.clientsharing / 100) : val.client_arbtodaymtm = val.netmtm * (val.clientsharing / 100)
                val.currency == 'USD' ? val.broker_arbtodaymtm = val.netmtm * (val.usdrate == 1 ? usdrate : val.usdrate) * (val.broksharing / 100) : val.broker_arbtodaymtm = val.netmtm * (val.broksharing / 100)
                val.currency == 'USD' ? val.company_arbtodaymtm = val.netmtm * (val.usdrate == 1 ? usdrate : val.usdrate) * (val.comsharing / 100) : val.company_arbtodaymtm = val.netmtm * (val.comsharing / 100)

                val.exchange == 'SGXFO' ? val.sgxtodaymtm = val.netmtm : val.sgxtodaymtm = 0
                val.exchange == 'SGXFO' ? val.client_sgxtodaymtm = val.netmtm * (val.clientsharing / 100) : val.client_sgxtodaymtm = 0
                val.exchange == 'SGXFO' ? val.broker_sgxtodaymtm = val.netmtm * (val.broksharing / 100) : val.broker_sgxtodaymtm = 0
                val.exchange == 'SGXFO' ? val.company_sgxtodaymtm = val.netmtm * (val.comsharing / 100) : val.company_sgxtodaymtm = 0

                val.exchange == 'NSEFO' ? val.nsetodaymtm = val.netmtm : val.nsetodaymtm = 0
                val.exchange == 'NSEFO' ? val.client_nsetodaymtm = val.netmtm * (val.clientsharing / 100) : val.client_nsetodaymtm = 0
                val.exchange == 'NSEFO' ? val.broker_nsetodaymtm = val.netmtm * (val.broksharing / 100) : val.broker_nsetodaymtm = 0
                val.exchange == 'NSEFO' ? val.company_nsetodaymtm = val.netmtm * (val.comsharing / 100) : val.company_nsetodaymtm = 0

                val.exchange == 'SGXFO' ? val.sgxqty = val.cfqty : val.sgxqty = 0
                val.exchange == 'SGXFO' ? val.client_sgxqty = val.cfqty * (val.clientsharing / 100) : val.client_sgxqty = 0
                val.exchange == 'SGXFO' ? val.broker_sgxqty = val.cfqty * (val.broksharing / 100) : val.broker_sgxqty = 0
                val.exchange == 'SGXFO' ? val.company_sgxqty = val.cfqty * (val.comsharing / 100) : val.company_sgxqty = 0

                val.symbol == 'NIFTY' && val.opttype == 'CE' ? val.nseceqty = val.cfqty : val.nseceqty = 0
                val.symbol == 'NIFTY' && val.opttype == 'CE' ? val.client_nseceqty = val.cfqty * (val.clientsharing / 100) : val.client_nseceqty = 0
                val.symbol == 'NIFTY' && val.opttype == 'CE' ? val.broker_nseceqty = val.cfqty * (val.broksharing / 100) : val.broker_nseceqty = 0
                val.symbol == 'NIFTY' && val.opttype == 'CE' ? val.company_nseceqty = val.cfqty * (val.comsharing / 100) : val.company_nseceqty = 0

                val.symbol == 'NIFTY' && val.opttype == 'PE' ? val.nsepeqty = val.cfqty : val.nsepeqty = 0
                val.symbol == 'NIFTY' && val.opttype == 'PE' ? val.client_nsepeqty = val.cfqty * (val.clientsharing / 100) : val.client_nsepeqty = 0
                val.symbol == 'NIFTY' && val.opttype == 'PE' ? val.broker_nsepeqty = val.cfqty * (val.broksharing / 100) : val.broker_nsepeqty = 0
                val.symbol == 'NIFTY' && val.opttype == 'PE' ? val.company_nsepeqty = val.cfqty * (val.comsharing / 100) : val.company_nsepeqty = 0

                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' ? val.nsefutqty = val.cfqty : val.nsefutqty = 0)
                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' ? val.client_nsefutqty = val.cfqty * (val.clientsharing / 100) : val.client_nsefutqty = 0)
                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' ? val.broker_nsefutqty = val.cfqty * (val.broksharing / 100) : val.broker_nsefutqty = 0)
                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' ? val.company_nsefutqty = val.cfqty * (val.comsharing / 100) : val.company_nsefutqty = 0)

                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' || val.opttype == 'CE') ? val.nsetotalqty = val.cfqty : val.nsetotalqty = 0
                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' || val.opttype == 'CE') ? val.client_nsetotalqty = val.cfqty * (val.clientsharing / 100) : val.client_nsetotalqty = 0
                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' || val.opttype == 'CE') ? val.broker_nsetotalqty = val.cfqty * (val.broksharing / 100) : val.broker_nsetotalqty = 0
                val.exchange == 'NSEFO' && val.symbol == 'NIFTY' && (val.opttype == 'XX' || val.opttype == 'CE') ? val.company_nsetotalqty = val.cfqty * (val.comsharing / 100) : val.company_nsetotalqty = 0

                return val;
            })
            // console.log(Groupdata);

            Groupdata = _(Groupdata).groupBy(x => x.userid + '#' + x.groupname + '#' + x.segment).map((value, id) => (
                {
                    'userid': id.split('#')[0],
                    'groupname': id.split('#')[1],
                    'segment': id.split('#')[2],

                    // 'client_share': _.meanBy(value, 'clientsharing'),
                    // 'broker_share': _.meanBy(value, 'broksharing'),
                    // 'company_share': _.meanBy(value, 'comsharing'),
                    'arbtodaymtm': _.sumBy(value, 'arbtodaymtm'),
                    'client_arbtodaymtm': _.sumBy(value, 'client_arbtodaymtm'),
                    'broker_arbtodaymtm': _.sumBy(value, 'broker_arbtodaymtm'),
                    'company_arbtodaymtm': _.sumBy(value, 'company_arbtodaymtm'),

                    'sgxtodaymtm': _.sumBy(value, 'sgxtodaymtm'),
                    'client_sgxtodaymtm': _.sumBy(value, 'client_sgxtodaymtm'),
                    'broker_sgxtodaymtm': _.sumBy(value, 'broker_sgxtodaymtm'),
                    'company_sgxtodaymtm': _.sumBy(value, 'company_sgxtodaymtm'),

                    'nsetodaymtm': _.sumBy(value, 'nsetodaymtm'),
                    'client_nsetodaymtm': _.sumBy(value, 'client_nsetodaymtm'),
                    'broker_nsetodaymtm': _.sumBy(value, 'broker_nsetodaymtm'),
                    'company_nsetodaymtm': _.sumBy(value, 'company_nsetodaymtm'),

                    'sgxqty': _.sumBy(value, 'sgxqty'),
                    'client_sgxqty': _.sumBy(value, 'client_sgxqty'),
                    'broker_sgxqty': _.sumBy(value, 'broker_sgxqty'),
                    'company_sgxqty': _.sumBy(value, 'company_sgxqty'),

                    'nseceqty': _.sumBy(value, 'nseceqty'),
                    'client_nseceqty': _.sumBy(value, 'client_nseceqty'),
                    'broker_nseceqty': _.sumBy(value, 'broker_nseceqty'),
                    'company_nseceqty': _.sumBy(value, 'company_nseceqty'),

                    'nsepeqty': _.sumBy(value, 'nsepeqty'),
                    'client_nsepeqty': _.sumBy(value, 'client_nsepeqty'),
                    'broker_nsepeqty': _.sumBy(value, 'broker_nsepeqty'),
                    'company_nsepeqty': _.sumBy(value, 'company_nsepeqty'),

                    'nsefutqty': _.sumBy(value, 'nsefutqty'),
                    'client_nsefutqty': _.sumBy(value, 'client_nsefutqty'),
                    'broker_nsefutqty': _.sumBy(value, 'broker_nsefutqty'),
                    'company_nsefutqty': _.sumBy(value, 'company_nsefutqty'),

                    'nsetotalqty': _.sumBy(value, 'nsetotalqty'),
                    'client_nsetotalqty': _.sumBy(value, 'client_nsetotalqty'),
                    'broker_nsetotalqty': _.sumBy(value, 'broker_nsetotalqty'),
                    'company_nsetotalqty': _.sumBy(value, 'company_nsetotalqty'),

                })).value()


            Groupdata = _.sortBy(Groupdata, 'userid');
            if (datasummary !== undefined) {
                if (Groupdata.length > 0) {
                    for (let i = 0; i < datasummary.length; i++) {
                        for (let j = 0; j < Groupdata.length; j++) {
                            if (datasummary[i]['userid'] == Groupdata[j]['userid'] && datasummary[i]['groupname'] == Groupdata[j]['groupname'] && datasummary[i]['segment'] == Groupdata[j]['segment']) {

                                datasummary[i]['arbtodaymtm'] = Groupdata[j]['arbtodaymtm']
                                datasummary[i]['client_arbtodaymtm'] = Groupdata[j]['client_arbtodaymtm']
                                datasummary[i]['broker_arbtodaymtm'] = Groupdata[j]['broker_arbtodaymtm']
                                datasummary[i]['company_arbtodaymtm'] = Groupdata[j]['company_arbtodaymtm']

                                datasummary[i]['sgxtodaymtm'] = Groupdata[j]['sgxtodaymtm']
                                datasummary[i]['client_sgxtodaymtm'] = Groupdata[j]['client_sgxtodaymtm']
                                datasummary[i]['broker_sgxtodaymtm'] = Groupdata[j]['broker_sgxtodaymtm']
                                datasummary[i]['company_sgxtodaymtm'] = Groupdata[j]['company_sgxtodaymtm']

                                datasummary[i]['nsetodaymtm'] = Groupdata[j]['nsetodaymtm']
                                datasummary[i]['client_nsetodaymtm'] = Groupdata[j]['client_nsetodaymtm']
                                datasummary[i]['broker_nsetodaymtm'] = Groupdata[j]['broker_nsetodaymtm']
                                datasummary[i]['company_nsetodaymtm'] = Groupdata[j]['company_nsetodaymtm']

                                datasummary[i]['sgxqty'] = Groupdata[j]['sgxqty']
                                datasummary[i]['client_sgxqty'] = Groupdata[j]['client_sgxqty']
                                datasummary[i]['broker_sgxqty'] = Groupdata[j]['broker_sgxqty']
                                datasummary[i]['company_sgxqty'] = Groupdata[j]['company_sgxqty']

                                datasummary[i]['nseceqty'] = Groupdata[j]['nseceqty']
                                datasummary[i]['client_nseceqty'] = Groupdata[j]['client_nseceqty']
                                datasummary[i]['broker_nseceqty'] = Groupdata[j]['broker_nseceqty']
                                datasummary[i]['company_nseceqty'] = Groupdata[j]['company_nseceqty']

                                datasummary[i]['nsepeqty'] = Groupdata[j]['nsepeqty']
                                datasummary[i]['client_nsepeqty'] = Groupdata[j]['client_nsepeqty']
                                datasummary[i]['broker_nsepeqty'] = Groupdata[j]['broker_nsepeqty']
                                datasummary[i]['company_nsepeqty'] = Groupdata[j]['company_nsepeqty']

                                datasummary[i]['nsefutqty'] = Groupdata[j]['nsefutqty']
                                datasummary[i]['client_nsefutqty'] = Groupdata[j]['client_nsefutqty']
                                datasummary[i]['broker_nsefutqty'] = Groupdata[j]['broker_nsefutqty']
                                datasummary[i]['company_nsefutqty'] = Groupdata[j]['company_nsefutqty']

                                datasummary[i]['nsetotalqty'] = Groupdata[j]['nsetotalqty']
                                datasummary[i]['client_nsetotalqty'] = Groupdata[j]['client_nsetotalqty']
                                datasummary[i]['broker_nsetotalqty'] = Groupdata[j]['broker_nsetotalqty']
                                datasummary[i]['company_nsetotalqty'] = Groupdata[j]['company_nsetotalqty']
                            }
                        }
                    }
                }


                Groupdata = datasummary.filter(val => {
                    val.out = Math.abs((val.sgxqty * val.hedgeratio) + val.nsetotalqty)
                    val.client_out = Math.abs((val.client_sgxqty * val.hedgeratio) + val.client_nsetotalqty)
                    val.broker_out = Math.abs((val.broker_sgxqty * val.hedgeratio) + val.broker_nsetotalqty)
                    val.company_out = Math.abs((val.company_sgxqty * val.hedgeratio) + val.company_nsetotalqty)

                    val.nsetotalmtm = val.nsebfmtm + val.nsetodaymtm
                    val.client_nsetotalmtm = val.client_nsebfmtm + val.client_nsetodaymtm
                    val.broker_nsetotalmtm = val.broker_nsebfmtm + val.broker_nsetodaymtm
                    val.company_nsetotalmtm = val.company_nsebfmtm + val.company_nsetodaymtm

                    val.sgxtotalmtm = val.sgxbfmtm + val.sgxtodaymtm
                    val.client_sgxtotalmtm = val.client_sgxbfmtm + val.client_sgxtodaymtm
                    val.broker_sgxtotalmtm = val.broker_sgxbfmtm + val.broker_sgxtodaymtm
                    val.company_sgxtotalmtm = val.company_sgxbfmtm + val.company_sgxtodaymtm

                    val.arbtotalmtm = val.arbbfmtm + val.arbtodaymtm
                    val.client_arbtotalmtm = val.client_arbbfmtm + val.client_arbtodaymtm
                    val.broker_arbtotalmtm = val.broker_arbbfmtm + val.broker_arbtodaymtm
                    val.company_arbtotalmtm = val.company_arbbfmtm + val.company_arbtodaymtm

                    return val
                })
            }

            return Groupdata;
        } else {
            Groupdata = datasummary.filter(val => {
                val.out = Math.abs((val.sgxqty * val.hedgeratio) + val.nsetotalqty)
                val.client_out = Math.abs((val.client_sgxqty * val.hedgeratio) + val.client_nsetotalqty)
                val.broker_out = Math.abs((val.broker_sgxqty * val.hedgeratio) + val.broker_nsetotalqty)
                val.company_out = Math.abs((val.company_sgxqty * val.hedgeratio) + val.company_nsetotalqty)

                val.nsetotalmtm = val.nsebfmtm + val.nsetodaymtm
                val.client_nsetotalmtm = val.client_nsebfmtm + val.client_nsetodaymtm
                val.broker_nsetotalmtm = val.broker_nsebfmtm + val.broker_nsetodaymtm
                val.company_nsetotalmtm = val.company_nsebfmtm + val.company_nsetodaymtm

                val.sgxtotalmtm = val.sgxbfmtm + val.sgxtodaymtm
                val.client_sgxtotalmtm = val.client_sgxbfmtm + val.client_sgxtodaymtm
                val.broker_sgxtotalmtm = val.broker_sgxbfmtm + val.broker_sgxtodaymtm
                val.company_sgxtotalmtm = val.company_sgxbfmtm + val.company_sgxtodaymtm

                val.arbtotalmtm = val.arbbfmtm + val.arbtodaymtm
                val.client_arbtotalmtm = val.client_arbbfmtm + val.client_arbtodaymtm
                val.broker_arbtotalmtm = val.broker_arbbfmtm + val.broker_arbtodaymtm
                val.company_arbtotalmtm = val.company_arbbfmtm + val.company_arbtodaymtm

                return val
            })
            return Groupdata;
        }
    }
}

export function createExposure(netposition, Broadcaster) {
    if (Broadcaster && netposition) {
        let ExpoData = JSON.parse(JSON.stringify(netposition));
        let Price = Broadcaster && Broadcaster.filter(val => { return val.securitytype == 'FUT' && (val.symbol == 'NIFTY') })
        ExpoData = ExpoData.filter((val) => {
            val.opttype == 'CE' ? val.nseceqty = val.cfqty : val.nseceqty = 0
            val.opttype == 'PE' ? val.nsepeqty = val.cfqty : val.nsepeqty = 0
            val.exchange == 'NSEFO' && (val.opttype == 'XX' ? val.nsefutqty = val.cfqty : val.nsefutqty = 0)
            return new Date(val.expirydate).getDate() != new Date().getDate();
        })
        // console.log(ExpoData);

        ExpoData = _(ExpoData).groupBy(x => Months[new Date(x.expirydate).getMonth()]).map((value, id) => (
            {
                'expirydate': id,
                'nseceqty': _.sumBy(value, 'nseceqty'),
                'nsepeqty': _.sumBy(value, 'nsepeqty'),
                'nsefutqty': _.sumBy(value, 'nsefutqty'),
            })).value()

        for (let i = 0; i < ExpoData.length; i++) {
            for (let j = 0; j < Price.length; j++) {
                if (ExpoData[i]['expirydate'] == Months[new Date(Price[j]['expirydate']).getMonth()]) {
                    ExpoData[i]['nseceexpo'] = (ExpoData[i]['nseceqty'] * Price[j]['ltp']) / 10000000
                    ExpoData[i]['nsepeexpo'] = (ExpoData[i]['nsepeqty'] * Price[j]['ltp']) / 10000000
                    ExpoData[i]['nsefutexpo'] = (ExpoData[i]['nsefutqty'] * Price[j]['ltp']) / 10000000
                    ExpoData[i]['FUTEXPO'] = parseInt((ExpoData[i]['nsefutqty'] * Price[j]['ltp']) / 10000000)
                    ExpoData[i]['OPTEXPO'] = parseInt(Math.abs((ExpoData[i]['nseceqty'] * Price[j]['ltp']) / 10000000) + Math.abs((ExpoData[i]['nsepeqty'] * Price[j]['ltp']) / 10000000))
                }
            }
        }
        return ExpoData
    }
}

export function createBalance(datasummary, balance, cardfilter) {

    let Data = JSON.parse(JSON.stringify(balance));

    if (datasummary != undefined) {
        if (datasummary.length > 0) {
            // console.log(datasummary);
            Data = Data.map((val) => {
                // val.tilllyesterday = _.sum(datasummary.map((val) => { return val[(cardfilter.type == '' ? "" : cardfilter.type + "_") + cardfilter.exchange + "bfmtm"] }));
                val.tilllyesterday =
                    isNaN(_.sum(datasummary.map((val) => { return val[(cardfilter.type == '' ? "" : cardfilter.type + "_") + cardfilter.exchange + "bfmtm"] })))
                        ?
                        0
                        :
                        _.sum(datasummary.map((val) => { return val[(cardfilter.type == '' ? "" : cardfilter.type + "_") + cardfilter.exchange + "bfmtm"] }));
                val.todayposition =
                    isNaN(_.sum(datasummary.map((val) => { return val[(cardfilter.type == '' ? "" : cardfilter.type + "_") + cardfilter.exchange + (cardfilter.exchange == 'nse' ? "totalqty" : "qty")] })))
                        ?
                        0
                        :
                        _.sum(datasummary.map((val) => { return val[(cardfilter.type == '' ? "" : cardfilter.type + "_") + cardfilter.exchange + (cardfilter.exchange == 'nse' ? "totalqty" : "qty")] }));
                val.today =
                    isNaN(_.sum(datasummary.map((val) => { return val[(cardfilter.type == '' ? "" : cardfilter.type + "_") + cardfilter.exchange + "todaymtm"] })))
                        ?
                        0
                        :
                        _.sum(datasummary.map((val) => { return val[(cardfilter.type == '' ? "" : cardfilter.type + "_") + cardfilter.exchange + "todaymtm"] }));
                val.current = val.tilllyesterday + val.today;
                val.percentagechange = isNaN((val.today / (val.tilllyesterday)) * 100) ? 0 : (val.today / (val.tilllyesterday)) * 100;
                val.currency = cardfilter.exchange == 'sgx' ? "USD" : "INR"
                return val;
            })

        }
    }
    return Data
}

export function convertIntoKeyValue(data) {
    let temp = Object.keys(data);
    let final = [];

    for (let i = 0; i < data[temp[0]].length; i++) {
        let objofdata = {};
        for (let j = 0; j < temp.length; j++) {
            objofdata[temp[j]] = data[temp[j]][i];
        }
        final.push(objofdata);
    }
    return final;
}


export function Decompressed(data) {
    try {
        const gezipedData = atob(data)
        const gzipedDataArray = Uint8Array.from(gezipedData, c => c.charCodeAt(0))
        const ungzipedData = Pako.ungzip(gzipedDataArray);
        return JSON.parse(new TextDecoder().decode(ungzipedData))
    }
    catch {
        console.log('catch');
    }

}