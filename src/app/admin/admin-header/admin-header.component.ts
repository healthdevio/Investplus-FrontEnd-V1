import { Component, OnInit, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { UserLoginService } from "../../core/service/cognito/user-login.service";
import { Router } from "@angular/router";
import { Scopes } from '../../core/interface/scopes';
import { CognitoUtil } from '../../core/service/cognito/cognito.service';
import { EventEmitterService } from "../../core/service/event-emitter-service.service";
import { Investor } from "../../core/interface/investor";
import { TitleService } from "../../core/service/title.service";
import { TitleHeader } from "../../core/interface/title-header";

declare var toastr: any;

@Component({
  selector: "app-admin-header",
  templateUrl: "./admin-header.component.html",
  styleUrls: ["./admin-header.component.css"],
})
export class AdminHeaderComponent implements OnInit {

  investor: Investor;
  getFirtLetter: any;
  sidebarExpanded = true;
  titleHeader: TitleHeader;
  scopes = new Scopes;
  scopesUser = [];

  isMenuOppened = false;

  isCollapsed = false;

  isSvgRotated = false;
  isSvgRotatedImportated = false;

  enterpriseSubItens = [
    {
      name: 'Investidores',
      link: '/admin/investors',
      subCategory: null,
      isExpanded: false
    },
    {
      name: 'Publicação',
      link: null,
      subCategory: [
        {
          name: 'Atualizar Dados',
          link: '/admin/rounds/approval',
        },
        {
          name: 'Criar Rodada',
          link: '/admin/rounds/approval/company/final',
        },
        {
          name: 'Atualizar Rodada',
          link: '/admin/rounds/approval/company/publish',
        },
      ],
      isExpanded: false
    },
    {
      name: 'Atualizações',
      link: null,
      subCategory: [
        {
          name: 'Dados gerais',
          link: '/admin/rounds/approval',
        },
        {
          name: 'Valutation',
          link: '/admin/rounds/company/valuation',
        },
        {
          name: 'Captable',
          link: '/admin/rounds/company/captable',
        },
        {
          name: 'Receita e despesa',
          link: '/admin/rounds/company/financial',
        },
        {
          name: 'Administradores',
          link: '/admin/rounds/company/admin',
        },
        {
          name: 'Equipe Executiva',
          link: '/admin/rounds/company/team',
        },
        {
          name: 'Quadro societário',
          link: '/admin/rounds/company/partners',
        },
      ],
      isExpanded: false
    },
    {
      name: 'Investimentos',
      link: null,
      subCategory: [
        {
          name: 'Investimentos Realizados',
          link: '/admin/rounds/company/investments',
        },
      ],
      isExpanded: false
    },
  ];

  importatedSubItens = [
    {
      name: 'Criar Rodada',
      link: '/admin/rounds/approval/company/publish',
    }
  ];

  toggleMenu(): void {
    this.isMenuOppened = !this.isMenuOppened;
  }

  toggleSvgRotation(): void {
    this.isSvgRotated = !this.isSvgRotated;
  }

  toggleSvgRotationImportated(): void {
    this.isSvgRotatedImportated = !this.isSvgRotatedImportated;
  }

  toggleSubItems(item): void {
    item.isExpanded = !item.isExpanded;
  }

  constructor(
    private userService: UserLoginService,
    private router: Router,
    private cognitoUtil: CognitoUtil,
    private eventEmitter: EventEmitterService,
    private data: TitleService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  base64textString = "";

  ngOnInit() {
    this.data.currentMessage.subscribe((titles) => (this.titleHeader = titles));
    this.getUser();
    const $this = this;
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (session.isValid()) {
          const tokenId = session.getIdToken();
          const cognitoGroups = tokenId['payload']['cognito:groups'];
          cognitoGroups.forEach(element => {
            $this.scopesUser[element] = true;
          });
        }
      });
    }
    Object.assign(this.scopes, this.scopesUser);
    this.getUser();
  }

  // logout() {
  //   this.userService.logout();
  //   window.location.href = "https://investplus.vc/";
  // }

  getUser() {
    this.eventEmitter.emitter.subscribe((response) => {
      if (response.name === "get.user") {
        this.investor = response.data;
        this.base64textString =
          response.data.avatar === undefined
            ? "./../../../assets/img/default-profile_01.png"
            : "data:image/png;base64," + response.data.avatar;
        this.getFirtLetter = response.data.nickname.charAt(0);
  
        const {
          areasInterestLearning,
          favoriteChannel,
          interestSectors,
          motivationInvestment,
          objectiveInvestment,
          otherMotivation,
          otherSector,
          skillsDevelop,
          email,
          fullName,
          phone,
          nickname,
          rg
        } = response.data;
  
        const arraysEmpty =
          !areasInterestLearning.length &&
          !favoriteChannel.length &&
          !interestSectors.length &&
          !motivationInvestment.length &&
          !objectiveInvestment.length &&
          !otherMotivation.length &&
          !otherSector.length &&
          !skillsDevelop.length;
  
        const requiredFieldsFilled =
          email &&
          fullName &&
          phone &&
          nickname &&
          rg;
  
        if (arraysEmpty && requiredFieldsFilled && !document.querySelector('.toast-warning')) {
          toastr.options = {
            closeButton: true,
            timeOut: 10000,   
            extendedTimeOut: 5000, 
            progressBar: true, 
            positionClass: "toast-top-right",
          };
  
          toastr.warning(
            "Na Aba de preenchimento de seu perfil foram adicionadas perguntas de qualificação de investidor e a seção de aprendizado. Por favor, preencha essas perguntas o mais breve possível.",
            "Atenção"
          );
        }
      }
    });
  }
  
  

  adjustHeaderWidth(sidebarExpanded: boolean) {
    console.log("header componente", sidebarExpanded)
    this.sidebarExpanded = sidebarExpanded;
    this.updateHeaderStyle();
  }

  updateHeaderStyle() {
    const headerElement = this.el.nativeElement.querySelector('.main-header nav');
    if (headerElement) {
      const marginLeft = this.sidebarExpanded ? '17.35%' : '6%';
      const width = this.sidebarExpanded ? 'calc(100% - 17.4%)' : 'calc(100% - 6%)';

      this.renderer.setStyle(headerElement, 'margin-left', marginLeft);
      this.renderer.setStyle(headerElement, 'width', width);
    }
  }

  logout() {
    this.userService.logout();
    window.location.href = "/auth/login";
  }


}
