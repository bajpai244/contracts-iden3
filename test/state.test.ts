import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import bigInt from "big-integer";

describe("State", () => {
    let verifier;
    let state;

    before(async () => {
        const Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();

        const State = await ethers.getContractFactory("State");
        state = await upgrades.deployProxy(State, [verifier.address])
        await state.deployed();
    });

    // Note: smart contract params (including proofs) were generated by the publisher server

    it("Positive: initial state publishing", async () => {
        const params = {
            "id": "379949150130214723420589610911161895495647789006649785264738141299135414272",
            "oldState": "18656147546666944484453899241916469544090258810192803949522794490493271005313",
            "newState": "8061408109549794622894897529509400209321866093562736009325703847306244896707",
            "isOldStateGenesis": true,
            "a": [
                "10347780454086851208493657171712536489269513786704455355133174299378847353609",
                "11084065080834824950390811157685121837609057911198039717786721768175107252231"
            ],
            "b": [
                [
                    "7932904354947224084229823719355484175061804417248024890379201062844822388281",
                    "20120860264145569884647289401617875238542167556569538021719784828291528264197"
                ],
                [
                    "10500124118702410926822153245995424883929475302667648233463935875991256223092",
                    "8432890735219345305363176817309260462570093605428582539786650064061453163056"
                ]
            ],
            "c": [
                "17511338599952556961500165224525949750469142956621223990808844780874062091982",
                "8421296499451492175884229755905361243582418723911179628584413418297981785191"
            ]
        }

        await state.transitState(params.id, params.oldState, params.newState, params.isOldStateGenesis, params.a, params.b, params.c);
        const res0 = await state.getState(params.id);
        expect(res0.toString()).to.be.equal(bigInt(params.newState).toString());

        const transitionInfoNew = await state.getTransitionInfo(params.newState);
        expect(transitionInfoNew[0].toString()).to.be.equal("0"); // replaced timestamp
        expect(transitionInfoNew[1].toString()).not.be.empty; // creation timestamp
        expect(transitionInfoNew[2].toString()).to.be.equal("0"); // replaced block
        expect(transitionInfoNew[3].toString()).not.be.empty;// creation block
        expect(transitionInfoNew[4].toString()).to.be.equal(bigInt(params.id).toString()); // id
        expect(transitionInfoNew[5].toString()).to.be.equal("0"); // replaced by

        const transitionInfoOld = await state.getTransitionInfo(params.oldState);
        expect(transitionInfoOld[0].toString()).to.be.equal(transitionInfoNew[1].toString()); // replaced timestamp
        expect(transitionInfoOld[1].toString()).to.be.equal(bigInt(0).toString()); // creation timestamp
        expect(transitionInfoOld[2].toString()).to.be.equal(transitionInfoNew[3].toString()); // replaced block
        expect(transitionInfoOld[3].toString()).to.be.equal("0"); // creation block
        expect(transitionInfoOld[4].toString()).to.be.equal(bigInt(params.id).toString()); // id
        expect(transitionInfoOld[5].toString()).to.be.equal(bigInt(params.newState).toString()); // replaced by

    });

    it("Positive: regular state update", async () => {


        const params = {
            "id": "379949150130214723420589610911161895495647789006649785264738141299135414272",
            "oldState": "8061408109549794622894897529509400209321866093562736009325703847306244896707",
            "newState": "5451025638486093373823263243878919389573792510506430020873967410859218112302",
            "isOldStateGenesis": false,
            "a": [
                "19725330420158883457826002781354565752958923121307518972387710865179195572649",
                "19408240686606893199134159430855235003880334653750215918703715679120569069034",
            ],
            "b": [
                [
                    "20920580057357732139614818571947155040911568638036927960587820433833480055675",
                    "14559957051878949102866803162299473215891811550469150227217304285083535698438"
                ],
                [
                    "6142191132351958978628891708942146389058484277233199117163172259280084368127",
                    "18806724877703300275525639826494684986038053767500026301477088514230741469044"
                ]
            ],
            "c": [
                "21134959262359429170006814013718043787242547419892649612442716566298498014832",
                "9010057903984009774471918936602041982618575137368917742383118185666477185109",
            ],
        };
        const transitionInfoStateBeforeUpdate = await state.getTransitionInfo(params.oldState);

        await state.transitState(params.id, params.oldState, params.newState, params.isOldStateGenesis, params.a, params.b, params.c);
        const res = await state.getState(params.id);
        expect(res.toString()).to.be.equal(bigInt(params.newState).toString());

        const transitionInfoNew = await state.getTransitionInfo(params.newState);
        expect(transitionInfoNew[0].toString()).to.be.equal("0"); // replaced timestamp
        expect(transitionInfoNew[1].toString()).not.be.empty; // creation timestamp
        expect(transitionInfoNew[2].toString()).to.be.equal("0"); // replaced block
        expect(transitionInfoNew[3].toString()).not.be.empty;// creation block
        expect(transitionInfoNew[4].toString()).to.be.equal(bigInt(params.id).toString()); // id
        expect(transitionInfoNew[5].toString()).to.be.equal("0"); // replaced by

        const transitionInfoOld = await state.getTransitionInfo(params.oldState);
        expect(transitionInfoOld[0].toString()).to.be.equal(transitionInfoNew[1].toString()); // replaced timestamp
        expect(transitionInfoOld[1].toString()).to.be.equal(transitionInfoStateBeforeUpdate[1]); // creation timestamp must be not changed
        expect(transitionInfoOld[2].toString()).to.be.equal(transitionInfoNew[3].toString()); // replaced block
        !expect(transitionInfoOld[3].toString()).to.be.equal(transitionInfoStateBeforeUpdate[3]); // creation block must be not changed
        expect(transitionInfoOld[4].toString()).to.be.equal(bigInt(params.id).toString()); // id
        expect(transitionInfoOld[5].toString()).to.be.equal(bigInt(params.newState).toString()); // replaced by
    });

    it("Negative: state update with oldState param not equal the last state in the smart contract", async () => {

        const params = {
            "id": "379949150130214723420589610911161895495647789006649785264738141299135414272",
            "oldState": "18656147546666944484453899241916469544090258810192803949522794490493271005313",
            "newState": "8061408109549794622894897529509400209321866093562736009325703847306244896707",
            "isOldStateGenesis": false,
            "a": [
                "19199334096124144306969971688148091835319114950238470891114976963310681550012",
                "16953648910881355009244840075322278183610445861846108793426831933915050519721"
            ],
            "b": [
                [
                    "4930721897955833322888673907914572125539786148219289120574830971494239836096",
                    "4382117334763842965158094114737845444247143267717819507493385143245445495297"
                ],
                [
                    "13351638347917209617460516263354403601280022324390787709940682593789065480379",
                    "14158415251328701863600612996254438442075757706850842003103559362409568601777"
                ]
            ],
            "c": [
                "11087685014315916286077991711686810841996296866673689745960218136068063261961",
                "1101952250596507940009480237111758916141356508680126512170143672832985442917"
            ]
        }

        const expectedErrorText = "oldState argument should be equal to the latest identity state in smart contract when isOldStateGenesis == 0";
        let isException = false;
        try {
            await state.transitState(params.id, params.oldState, params.newState, params.isOldStateGenesis, params.a, params.b, params.c);
        } catch (e: any) {
            isException = true;
            expect(e.message).contains(expectedErrorText);
        }
        expect(isException).to.equal(true)

        const res = await state.getState(params.id);
        expect(res.toString()).to.not.be.equal(bigInt(params.newState).toString());
    });

    it("Negative: state publishing with isOldStateGenesis = 0 for initial state publishing", async () => {
        const params = {
            "id": "329949150130214723420589610911161895495647789006649785264738141299135414272",
            "oldState": "8061408109549794622894897529509400209321866093562736009325703847306244896707",
            "newState": "5451025638486093373823263243878919389573792510506430020873967410859218112302",
            "isOldStateGenesis": false,
            "a": [
                "9123530042567533646828922425772487350426456162482164386394882200839785942640",
                "9415307921947273965252020837563837769736935217738655289285974217793588520580",
            ],
            "b": [
                [
                    "20935778885211506570223376266828471506430371932508832162652558992203635947966",
                    "5508818874264996604372631831086863512981873969182281232851779203198165199858"
                ],
                [
                    "7582649530445089244527470093316718411976974567026715956160946701678788144099",
                    "15328003255722578273426427675683596906331019433013116900725008315768237010126"
                ]
            ],
            "c": [
                "11960369619177612085202166474468359141481452033953473766663574668254793582474",
                "2499582274802148691487974614055461818489209711650283363834328284825343196632",
            ],
        };


        const expectedErrorText = "there should be at least one state for identity in smart contract when isOldStateGenesis == 0";
        let isException = false;
        try {
            await state.transitState(params.id, params.oldState, params.newState, params.isOldStateGenesis, params.a, params.b, params.c);
        } catch (e: any) {
            isException = true;
            expect(e.message).contains(expectedErrorText);
        }
        expect(isException).to.equal(true)

        const res = await state.getState(params.id);
        expect(res.toString()).to.be.equal("0");
    });
});
