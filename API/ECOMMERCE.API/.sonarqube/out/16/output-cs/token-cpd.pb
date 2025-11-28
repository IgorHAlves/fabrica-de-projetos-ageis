ÅV
\/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Program.cs
	namespace 	
	ECOMMERCE
 
. 
API 
{ 
public 

class 
Program 
{ 
public 
static 
void 
Main 
(  
string  &
[& '
]' (
args) -
)- .
{ 	
var 
builder 
= 
WebApplication (
.( )
CreateBuilder) 6
(6 7
args7 ;
); <
;< =
builder 
. 
Services 
. 
AddControllers +
(+ ,
), -
;- .
builder 
. 
Services 
. #
AddEndpointsApiExplorer 4
(4 5
)5 6
;6 7
builder   
.   
Services   
.   
AddSwaggerGen   *
(  * +
)  + ,
;  , -
builder"" 
."" 
Services"" 
."" 
	AddScoped"" &
<""& '
IProductService""' 6
,""6 7
ProductServices""8 G
>""G H
(""H I
)""I J
;""J K
builder$$ 
.$$ 
Services$$ 
.$$ 
	AddScoped$$ &
<$$& '!
IAuthorizationService$$' <
,$$< = 
AuthorizationService$$> R
>$$R S
($$S T
)$$T U
;$$U V
builder&& 
.&& 
Services&& 
.&& 
	AddScoped&& &
<&&& '
IProductRepository&&' 9
,&&9 :
ProductRepository&&; L
>&&L M
(&&M N
)&&N O
;&&O P
builder(( 
.(( 
Services(( 
.(( 
	AddScoped(( &
<((& '
IUserService((' 3
,((3 4
UserService((5 @
>((@ A
(((A B
)((B C
;((C D
builder** 
.** 
Services** 
.** 
	AddScoped** &
<**& '
IUserRepository**' 6
,**6 7
UserRepository**8 F
>**F G
(**G H
)**H I
;**I J
builder,, 
.,, 
Services,, 
.,, 
	AddScoped,, &
<,,& '
IOrderService,,' 4
,,,4 5
OrderService,,6 B
>,,B C
(,,C D
),,D E
;,,E F
builder.. 
... 
Services.. 
... 
	AddScoped.. &
<..& '
IOrderRepository..' 7
,..7 8
OrderRepository..9 H
>..H I
(..I J
)..J K
;..K L
builder00 
.00 
Services00 
.00 
	AddScoped00 &
<00& '
ICategoryService00' 7
,007 8
CategoryService009 H
>00H I
(00I J
)00J K
;00K L
builder22 
.22 
Services22 
.22 
	AddScoped22 &
<22& '
ICategoryRepository22' :
,22: ;
CategoryRepository22< N
>22N O
(22O P
)22P Q
;22Q R
builder44 
.44 
Services44 
.44 
	AddScoped44 &
<44& '
ICouponRepository44' 8
,448 9
CouponRepository44: J
>44J K
(44K L
)44L M
;44M N
builder66 
.66 
Services66 
.66 
	AddScoped66 &
<66& '
ICouponService66' 5
,665 6
CouponService667 D
>66D E
(66E F
)66F G
;66G H
builder88 
.88 
Services88 
.88 
	AddScoped88 &
<88& '
	ViaCepApi88' 0
,880 1
	ViaCepApi882 ;
>88; <
(88< =
)88= >
;88> ?
builder:: 
.:: 
Services:: 
.:: 
	AddScoped:: &
<::& '
IShippingService::' 7
,::7 8
ShippingService::9 H
>::H I
(::I J
)::J K
;::K L
builder<< 
.<< 
Services<< 
.<< 
	AddScoped<< &
<<<& '

PixService<<' 1
,<<1 2

PixService<<3 =
><<= >
(<<> ?
)<<? @
;<<@ A
string>> 
mySqlConnection>> "
=>># $
builder>>% ,
.>>, -
Configuration>>- :
.>>: ;
GetConnectionString>>; N
(>>N O
$str>>O b
)>>b c
;>>c d
builder@@ 
.@@ 
Services@@ 
.@@ 
AddDbContext@@ )
<@@) *
EcommerceDbContext@@* <
>@@< =
(@@= >
options@@> E
=>@@F H
optionsAA 
.AA 
UseMySqlAA  
(AA  !
mySqlConnectionAA! 0
,AA0 1
ServerVersionAA2 ?
.AA? @

AutoDetectAA@ J
(AAJ K
mySqlConnectionAAK Z
)AAZ [
)AA[ \
)AA\ ]
;AA] ^
builderEE 
.EE 
ServicesEE 
.EE 
	AddScopedEE &
<EE& '!
IAuthorizationServiceEE' <
,EE< = 
AuthorizationServiceEE= Q
>EEQ R
(EER S
)EES T
;EET U
builderGG 
.GG 
ServicesGG 
.GG 
AddSwaggerGenGG *
(GG* +
cGG+ ,
=>GG- /
{HH 
cII 
.II !
AddSecurityDefinitionII '
(II' (
$strII( 0
,II0 1
newII2 5!
OpenApiSecuritySchemeII6 K
{JJ 
DescriptionKK 
=KK  !
$strKK" q
,KKq r
NameLL 
=LL 
$strLL *
,LL* +
InMM 
=MM 
ParameterLocationMM *
.MM* +
HeaderMM+ 1
,MM1 2
TypeNN 
=NN 
SecuritySchemeTypeNN -
.NN- .
ApiKeyNN. 4
,NN4 5
SchemeOO 
=OO 
$strOO %
}PP 
)PP 
;PP 
cRR 
.RR "
AddSecurityRequirementRR (
(RR( )
newRR) ,&
OpenApiSecurityRequirementRR- G
{SS 
{TT 
newUU !
OpenApiSecuritySchemeUU 1
{VV 
	ReferenceWW %
=WW& '
newWW( +
OpenApiReferenceWW, <
{XX 
TypeYY  $
=YY% &
ReferenceTypeYY' 4
.YY4 5
SecuritySchemeYY5 C
,YYC D
IdZZ  "
=ZZ# $
$strZZ% -
}[[ 
}\\ 
,\\ 
Array]] 
.]] 
Empty]] #
<]]# $
string]]$ *
>]]* +
(]]+ ,
)]], -
}^^ 
}__ 
)__ 
;__ 
}`` 
)`` 
;`` 
varbb !
authenticationOptionsbb %
=bb& '
builderbb( /
.cc 
Configurationcc 
.dd 

GetSectiondd 
(dd )
KeycloakAuthenticationOptionsdd 9
.dd9 :
Sectiondd: A
)ddA B
.ee 
Getee 
<ee )
KeycloakAuthenticationOptionsee 2
>ee2 3
(ee3 4
)ee4 5
;ee5 6
buildergg 
.gg 
Servicesgg 
.gg %
AddKeycloakAuthenticationgg 6
(gg6 7!
authenticationOptionsgg7 L
)ggL M
;ggM N
varii  
authorizationOptionsii $
=ii% &
builderii' .
.jj 
Configurationjj 
.kk 

GetSectionkk 
(kk +
KeycloakProtectionClientOptionskk ;
.kk; <
Sectionkk< C
)kkC D
.ll 
Getll 
<ll +
KeycloakProtectionClientOptionsll 4
>ll4 5
(ll5 6
)ll6 7
;ll7 8
buildernn 
.nn 
Servicesnn 
.nn $
AddKeycloakAuthorizationnn 5
(nn5 6 
authorizationOptionsnn6 J
)nnJ K
;nnK L
varpp 
adminClientOptionspp "
=pp# $
builderpp% ,
.qq 
Configurationqq 
.rr 

GetSectionrr 
(rr &
KeycloakAdminClientOptionsrr 6
.rr6 7
Sectionrr7 >
)rr> ?
.ss 
Getss 
<ss &
KeycloakAdminClientOptionsss /
>ss/ 0
(ss0 1
)ss1 2
;ss2 3
builderuu 
.uu 
Servicesuu 
.uu &
AddKeycloakAdminHttpClientuu 7
(uu7 8
adminClientOptionsuu8 J
)uuJ K
;uuK L
builder|| 
.|| 
Services|| 
.|| 
AddCors|| $
(||$ %
options||% ,
=>||- /
{}} 
options~~ 
.~~ 
	AddPolicy~~ !
(~~! "
$str~~" 0
,~~0 1
policy~~2 8
=>~~9 ;
{ 
policy
ÄÄ 
.
ÄÄ 
AllowAnyOrigin
ÄÄ )
(
ÄÄ) *
)
ÄÄ* +
.
ÅÅ 
AllowAnyHeader
ÅÅ '
(
ÅÅ' (
)
ÅÅ( )
.
ÇÇ 
AllowAnyMethod
ÇÇ '
(
ÇÇ' (
)
ÇÇ( )
;
ÇÇ) *
}
ÉÉ 
)
ÉÉ 
;
ÉÉ 
}
ÑÑ 
)
ÑÑ 
;
ÑÑ 
var
àà 
app
àà 
=
àà 
builder
àà 
.
àà 
Build
àà #
(
àà# $
)
àà$ %
;
àà% &
if
ãã 
(
ãã 
app
ãã 
.
ãã 
Environment
ãã 
.
ãã  
IsDevelopment
ãã  -
(
ãã- .
)
ãã. /
)
ãã/ 0
{
åå 
app
çç 
.
çç 

UseSwagger
çç 
(
çç 
)
çç  
;
çç  !
app
éé 
.
éé 
UseSwaggerUI
éé  
(
éé  !
)
éé! "
;
éé" #
}
èè 
app
ëë 
.
ëë !
UseHttpsRedirection
ëë #
(
ëë# $
)
ëë$ %
;
ëë% &
app
ìì 
.
ìì 
UseCors
ìì 
(
ìì 
$str
ìì &
)
ìì& '
;
ìì' (
app
îî 
.
îî 
UseAuthentication
îî !
(
îî! "
)
îî" #
;
îî# $
app
ïï 
.
ïï 
UseAuthorization
ïï  
(
ïï  !
)
ïï! "
;
ïï" #
app
òò 
.
òò 
MapControllers
òò 
(
òò 
)
òò  
;
òò  !
app
öö 
.
öö 
Run
öö 
(
öö 
)
öö 
;
öö 
}
õõ 	
}
úú 
}ùù §
o/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/UserController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[		 
ApiController		 
]		 
[

 
Route

 
(

 
$str

 
)

 
]

 
public 
class 
UserController 
: 

Controller (
{ 
private 
readonly 
IUserService !
_userService" .
;. /
public 

UserController 
( 
IUserService &
userService' 2
)2 3
{ 
_userService 
= 
userService "
;" #
} 
[ 
	Authorize 
] 
[ 
HttpGet 
] 
public 

async 
Task 
< 
IActionResult #
># $

VerifyUser% /
(/ 0
)0 1
{ 
string 

keycloakId 
= 
User  
.  !
	FindFirst! *
(* +

ClaimTypes+ 5
.5 6
NameIdentifier6 D
)D E
?E F
.F G
ValueG L
??M O
UserP T
.T U
	FindFirstU ^
(^ _
$str_ d
)d e
?e f
.f g
Valueg l
;l m

GetUserDTO 
	userLogin 
= 
_userService +
.+ ,

VerifyUser, 6
(6 7

keycloakId7 A
)A B
;B C
return 
Ok 
( 
	userLogin 
) 
; 
} 
[ 
	Authorize 
] 
[   
HttpPost   
]   
public!! 

async!! 
Task!! 
<!! 
IActionResult!! #
>!!# $
CreateAddress!!% 2
(!!2 3
[!!3 4
FromBody!!4 <
]!!< =
CreateAddressDTO!!> N
address!!O V
)!!V W
{"" 
string## 

keycloakId## 
=## 
User##  
.##  !
	FindFirst##! *
(##* +

ClaimTypes##+ 5
.##5 6
NameIdentifier##6 D
)##D E
?##E F
.##F G
Value##G L
??##M O
User##P T
.##T U
	FindFirst##U ^
(##^ _
$str##_ d
)##d e
?##e f
.##f g
Value##g l
;##l m
Guid%% 
	addressId%% 
=%% 
_userService%% %
.%%% &
CreateAddress%%& 3
(%%3 4

keycloakId%%4 >
,%%> ?
address%%? F
)%%F G
;%%G H
return'' 
Ok'' 
('' 
	addressId'' 
)'' 
;'' 
}(( 
}** û
s/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/ShippingController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[ 
ApiController 
] 
[ 
Route 
( 
$str 
) 
] 
public		 
class		 
ShippingController		 
:		  !
ControllerBase		" 0
{

 
private 
readonly 
IShippingService %
_shippingService& 6
;6 7
public 

ShippingController 
( 
IShippingService .
shippingService/ >
)> ?
{ 
_shippingService 
= 
shippingService *
;* +
} 
[ 
HttpGet 
( 
$str 
) 
] 
public 

async 
Task 
< 
IActionResult #
># $
GetShipping% 0
(0 1
string1 7
cep8 ;
); <
{ 
try 
{ 	
var 
address 
= 
await 
_shippingService  0
.0 1
GetShipping1 <
(< =
cep= @
)@ A
;A B
if 
( 
address 
== 
null 
)  
{ 
return 
NotFound 
(  
$"  "
$str" &
{& '
cep' *
}* +
$str+ ;
"; <
)< =
;= >
} 
return 
Ok 
( 
address 
) 
; 
} 	
catch 
( 
	Exception 
e 
) 
{ 	
throw   
new   
	Exception   
(    
e    !
.  ! "
Message  " )
)  ) *
;  * +
}!! 	
}"" 
}## ‹&
r/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/ProductController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[		 
ApiController		 
]		 
[

 
Route

 
(

 
$str

 
)

 
]

 
public 
class 
ProductController 
:  

Controller! +
{ 
private 
readonly 
IProductService $
_productService% 4
;4 5
public 

ProductController 
( 
IProductService -
productService. <
)< =
{ 
_productService 
= 
productService (
;( )
} 
[ 
HttpGet 
] 
public 

async 
Task 
< 
IActionResult #
># $
GetProducts% 0
(0 1
[1 2
	FromQuery2 ;
]; <
string= C
?C D
nameE I
,I J
[K L
	FromQueryL U
]U V
intW Z

pageNumber[ e
=f g
$numh i
,i j
[k l
	FromQueryl u
]u v
intw z
pageSize	{ É
=
Ñ Ö
$num
Ü à
)
à â
{ 
	Paginator 
< 
GetProductDTO 
>  
products! )
=* +
_productService, ;
.; <
GetProducts< G
(G H
nameH L
,L M

pageNumberM W
,W X
pageSizeY a
)a b
;b c
return 
Ok 
( 
products 
) 
; 
} 
[ 
HttpGet 
( 
$str 
)  
]  !
public 

async 
Task 
< 
IActionResult #
># $

GetProduct% /
(/ 0
[0 1
	FromRoute1 :
]: ;
Guid= A
	idProductB K
)K L
{ 
GetProductDTO 
product 
= 
_productService  /
./ 0

GetProduct0 :
(: ;
	idProduct; D
)D E
;E F
return!! 
Ok!! 
(!! 
product!! 
)!! 
;!! 
}"" 
[$$ 
	Authorize$$ 
($$ 
Roles$$ 
=$$ 
$str$$ 
)$$ 
]$$  
[%% 
HttpPost%% 
]%% 
public&& 

IActionResult&& 
PostProduct&& $
(&&$ %
[&&% &
FromBody&&& .
]&&. /
CreateProductDTO&&0 @
dto&&A D
)&&D E
{'' 
var(( 
product(( 
=(( 
_productService(( %
.((% &
CreateProduct((& 3
(((3 4
dto((4 7
)((7 8
;((8 9
return)) 
Ok)) 
()) 
product)) 
))) 
;)) 
}** 
[,, 
	Authorize,, 
(,, 
Roles,, 
=,, 
$str,, 
),, 
],,  
[-- 
HttpPut-- 
(-- 
$str-- 
)--  
]--  !
public.. 

IActionResult.. 

PutProduct.. #
(..# $
[..$ %
	FromRoute..% .
]... /
Guid..0 4
	idProduct..5 >
,..> ?
[..? @
FromBody..@ H
]..H I
UpdateProductDTO..J Z
dto..[ ^
)..^ _
{// 
var00 
product00 
=00 
_productService00 %
.00% &
UpdateProduct00& 3
(003 4
	idProduct004 =
,00= >
dto00> A
)00A B
;00B C
return11 
Ok11 
(11 
product11 
)11 
;11 
}22 
[44 
	Authorize44 
(44 
Roles44 
=44 
$str44 
)44 
]44  
[55 

HttpDelete55 
(55 
$str55 "
)55" #
]55# $
public77 

IActionResult77 
DeleteProduct77 &
(77& '
[77' (
	FromRoute77( 1
]771 2
Guid773 7
	idProduct778 A
)77A B
{88 
_productService99 
.99 
DeleteProduct99 %
(99% &
	idProduct99& /
)99/ 0
;990 1
return;; 
Ok;; 
(;; 
);; 
;;; 
}<< 
}== ˝
r/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/PaymentController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[ 
ApiController 
] 
[ 
Route 
( 
$str 
) 
] 
public		 
class		 
PaymentController		 
:		  
ControllerBase		! /
{

 
private 
readonly 

PixService 
_pixService  +
;+ ,
public 

PaymentController 
( 

PixService '

pixService( 2
)2 3
{ 
_pixService 
= 

pixService  
;  !
} 
[ 
HttpPost 
( 
nameof 
( 
	CreatePix 
) 
)  
]  !
public 

ActionResult 
	CreatePix !
(! "
[" #
FromBody# +
]+ ,
decimal- 4
value5 :
,: ;
Guid< @
orderIdA H
)H I
{ 
try 
{ 	
string 

paymentPix 
= 
_pixService  +
.+ ,
	CreatePix, 5
(5 6
value6 ;
,; <
orderId= D
.D E
ToStringE M
(M N
)N O
.O P
ReplaceP W
(W X
$strX [
,[ \
$str] _
)_ `
.` a
	Substringa j
(j k
$numk l
,l m
$numn p
)p q
)q r
;r s
if 
( 
string 
. 
IsNullOrEmpty $
($ %

paymentPix% /
)/ 0
)0 1
{ 
return 

BadRequest !
(! "
$str" 5
)5 6
;6 7
} 
return 
Ok 
( 

paymentPix  
)  !
;! "
} 	
catch 
( 
	Exception 
e 
) 
{ 	
throw   
new   
	Exception   
(    
e    !
.  ! "
Message  " )
)  ) *
;  * +
}!! 	
}"" 
}## °!
p/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/OrderController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[ 
ApiController 
] 
[ 
Route 
( 
$str 
) 
] 
public 
class 
OrderController 
: 
ControllerBase -
{ 
private 
readonly 
IOrderService "
_orderService# 0
;0 1
public 

OrderController 
( 
IOrderService (
orderService) 5
)5 6
{ 
_orderService 
= 
orderService $
;$ %
} 
[ 
HttpGet 
] 
public 

async 
Task 
< 
IActionResult #
># $
	GetOrders% .
(. /
[/ 0
	FromQuery0 9
]9 :
int; >

pageNumber? I
=J K
$numL M
,M N
[O P
	FromQueryP Y
]Y Z
int[ ^
pageSize_ g
=h i
$numj l
)l m
{ 
try 
{   	
	Paginator!! 
<!! 
GetOrderDTO!! !
>!!! "
orders!!# )
=!!* +
_orderService!!, 9
.!!9 :
	GetOrders!!: C
(!!C D

pageNumber!!D N
,!!N O
pageSize!!P X
)!!X Y
;!!Y Z
return## 
Ok## 
(## 
orders## 
)## 
;## 
}$$ 	
catch%% 
(%% 
	Exception%% 
e%% 
)%% 
{&& 	
throw'' 
new'' 
	Exception'' 
(''  
e''  !
.''! "
Message''" )
)'') *
;''* +
}(( 	
})) 
[,, 
HttpGet,, 
(,, 
$str,, 
),, 
],, 
public-- 

async-- 
Task-- 
<-- 
IActionResult-- #
>--# $
GetOrder--% -
(--- .
[--. /
	FromRoute--/ 8
]--8 9
Guid--: >
OrderId--? F
)--F G
{.. 
GetOrderDTO// 
order// 
=// 
_orderService// )
.//) *
GetOrder//* 2
(//2 3
OrderId//3 :
)//: ;
;//; <
if00 

(00 
OrderId00 
==00 
null00 
)00 
{11 	
return22 
NotFound22 
(22 
)22 
;22 
}33 	
return44 
Ok44 
(44 
order44 
)44 
;44 
}55 
[88 
	Authorize88 
]88 
[99 
HttpPost99 
]99 
public:: 

async:: 
Task:: 
<:: 
IActionResult:: #
>::# $
CreateOrder::% 0
(::0 1
[::1 2
FromBody::2 :
]::: ;
CreateOrderDTO::< J
orderDto::K S
)::S T
{;; 
string<< 

keycloakId<< 
=<< 
User<<  
.<<  !
	FindFirst<<! *
(<<* +

ClaimTypes<<+ 5
.<<5 6
NameIdentifier<<6 D
)<<D E
?<<E F
.<<F G
Value<<G L
??<<M O
User<<P T
.<<T U
	FindFirst<<U ^
(<<^ _
$str<<_ d
)<<d e
?<<e f
.<<f g
Value<<g l
;<<l m
orderDto>> 
.>> 
UserKeycloackId>>  
=>>! "

keycloakId>># -
;>>- .
Guid@@ 
order@@ 
=@@ 
_orderService@@ "
.@@" #
CreateOrder@@# .
(@@. /
orderDto@@/ 7
)@@7 8
;@@8 9
returnBB 
OkBB 
(BB 
orderBB 
)BB 
;BB 
}CC 
}EE ˜(
q/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/CouponController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[

 
ApiController

 
]

 
[ 
Route 
( 
$str 
) 
] 
public 
class 
CouponController 
: 
ControllerBase  .
{ 
private 
readonly 
ICouponService #
_couponService$ 2
;2 3
public 

CouponController 
( 
ICouponService *
couponService+ 8
)8 9
{ 
_couponService 
= 
couponService &
;& '
} 
[ 
HttpGet 
] 
public 

async 
Task 
< 
IActionResult #
># $

GetCoupons% /
(/ 0
[0 1
	FromQuery1 :
]: ;
int< ?

pageNumber@ J
=K L
$numM N
,N O
[O P
	FromQueryP Y
]Y Z
int[ ^
pageSize_ g
=h i
$numj l
)l m
{ 
try 
{ 	
	Paginator 
< 
GetCouponDTO "
>" #
couponsList$ /
=0 1
_couponService2 @
.@ A

GetCouponsA K
(K L

pageNumberL V
,V W
pageSizeX `
)` a
;a b
return 
Ok 
( 
couponsList !
)! "
;" #
} 	
catch 
( 
	Exception 
e 
) 
{ 	
throw 
new 
	Exception 
(  
e  !
.! "
Message" )
)) *
;* +
}   	
}!! 
[## 
HttpGet## 
(## 
$str## 
)## 
]## 
public$$ 

async$$ 
Task$$ 
<$$ 
IActionResult$$ #
>$$# $
	GetCoupon$$% .
($$. /
[$$/ 0
	FromRoute$$0 9
]$$9 :
string$$; A
code$$B F
)$$F G
{%% 
try&& 
{'' 	
var(( 
coupon(( 
=(( 
_couponService(( '
.((' (
FindCouponByCode((( 8
(((8 9
code((9 =
)((= >
;((> ?
return)) 
Ok)) 
()) 
coupon)) 
))) 
;)) 
}** 	
catch++ 
(++ 
	Exception++ 
e++ 
)++ 
{,, 	
throw-- 
new-- 
	Exception-- 
(--  
e--  !
.--! "
Message--" )
)--) *
;--* +
}.. 	
}// 
[11 
	Authorize11 
(11 
Roles11 
=11 
$str11 
)11 
]11  
[22 
HttpPost22 
]22 
public33 

async33 
Task33 
<33 
IActionResult33 #
>33# $
CreateCoupon33% 1
(331 2
CreateCouponDTO332 A
	couponDTO33B K
)33K L
{44 
try55 
{66 	
var77 
coupon77 
=77 
_couponService77 '
.77' (
CreateCoupon77( 4
(774 5
	couponDTO775 >
)77> ?
;77? @
return88 
Ok88 
(88 
coupon88 
)88 
;88 
}99 	
catch:: 
(:: 
	Exception:: 
e:: 
):: 
{;; 	
throw<< 
new<< 
	Exception<< 
(<<  
e<<  !
.<<! "
Message<<" )
)<<) *
;<<* +
}== 	
}>> 
[@@ 
	Authorize@@ 
(@@ 
Roles@@ 
=@@ 
$str@@ 
)@@ 
]@@  
[AA 

HttpDeleteAA 
(AA 
$strAA 
)AA 
]AA 
publicBB 

asyncBB 
TaskBB 
<BB 
IActionResultBB #
>BB# $
DeleteCouponBB% 1
(BB1 2
[BB2 3
	FromRouteBB3 <
]BB< =
stringBB> D
codeBBE I
)BBI J
{CC 
tryDD 
{EE 	
_couponServiceFF 
.FF 
DeleteCouponFF '
(FF' (
codeFF( ,
)FF, -
;FF- .
returnGG 
	NoContentGG 
(GG 
)GG 
;GG 
}HH 	
catchII 
(II 
	ExceptionII 
eII 
)II 
{JJ 	
throwKK 
newKK 
	ExceptionKK 
(KK  
eKK  !
.KK! "
MessageKK" )
)KK) *
;KK* +
}LL 	
}MM 
}OO  %
s/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/CategoryController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[		 
ApiController		 
]		 
[

 
Route

 
(

 
$str

 
)

 
]

 
public 
class 
CategoryController 
:  !
ControllerBase" 0
{ 
private 
readonly 
ICategoryService %
_categoryService& 6
;6 7
public 

CategoryController 
( 
ICategoryService .
categoryService/ >
)> ?
{ 
_categoryService 
= 
categoryService *
;* +
} 
[ 
HttpGet 
( 
$str 
) 
] 
public 

IActionResult 
GetCategory $
($ %
[% &
	FromRoute& /
]/ 0
Guid1 5
id6 8
)8 9
{ 
GetCategoriesDTO 
getCategory $
=% &
_categoryService' 7
.7 8
GetCategory8 C
(C D
idD F
)F G
;G H
return 
Ok 
( 
getCategory 
) 
; 
} 
[ 
HttpGet 
] 
public 

IActionResult 
GetCategories &
(& '
[' (
	FromQuery( 1
]1 2
string3 9
?9 :
name; ?
,? @
[A B
	FromQueryB K
]K L
intM P

pageNumberQ [
=\ ]
$num^ _
,_ `
[ 	
	FromQuery	 
] 
int 
pageSize  
=! "
$num# %
)% &
{   
	Paginator!! 
<!! 
GetCategoriesDTO!! "
>!!" #
getCategoriesList!!$ 5
=!!6 7
_categoryService!!8 H
.!!H I
GetCategories!!I V
(!!V W
name!!W [
,!![ \

pageNumber!!] g
,!!g h
pageSize!!i q
)!!q r
;!!r s
return"" 
Ok"" 
("" 
getCategoriesList"" #
)""# $
;""$ %
}## 
[%% 
	Authorize%% 
(%% 
Roles%% 
=%% 
$str%% 
)%% 
]%%  
[&& 
HttpPost&& 
]&& 
public'' 

IActionResult'' 
PostCategory'' %
(''% &
[''& '
FromBody''' /
]''/ 0
CreateCategoryDTO''1 B
dto''C F
)''F G
{(( 
var)) 
category)) 
=)) 
_categoryService)) '
.))' (
CreateCategory))( 6
())6 7
dto))7 :
))): ;
;)); <
return** 
Ok** 
(** 
category** 
)** 
;** 
}++ 
[.. 
	Authorize.. 
(.. 
Roles.. 
=.. 
$str.. 
).. 
]..  
[// 
HttpPut// 
(// 
$str// 
)// 
]// 
public00 

IActionResult00 
PutCategory00 $
(00$ %
[00% &
FromBody00& .
]00. /
UpdateCategoriesDTO000 C
dto00D G
)00G H
{11 
var22 
updateCategory22 
=22 
_categoryService22 -
.22- .
UpdateCategory22. <
(22< =
dto22= @
)22@ A
;22A B
return33 
Ok33 
(33 
updateCategory33  
)33  !
;33! "
}44 
[66 
	Authorize66 
(66 
Roles66 
=66 
$str66 
)66 
]66  
[77 

HttpDelete77 
(77 
$str77 
)77 
]77 
public88 

IActionResult88 
DeleteCategory88 '
(88' (
[88( )
	FromRoute88) 2
]882 3
Guid884 8
id889 ;
)88; <
{99 
var:: 
deleteCategory:: 
=:: 
_categoryService:: -
.::- .
DeleteCategory::. <
(::< =
id::= ?
)::? @
;::@ A
return;; 
Ok;; 
(;; 
deleteCategory;;  
);;  !
;;;! "
}<< 
}== œ
x/home/ti-acim/Documents/fabrica-de-projetos-ageis/API/ECOMMERCE.API/ECOMMERCE.API/Controllers/AuthorizationController.cs
	namespace 	
	ECOMMERCE
 
. 
API 
. 
Controllers #
;# $
[ 
ApiController 
] 
[ 
Route 
( 
$str 
) 
] 
public		 
class		 #
AuthorizationController		 $
:		% &
ControllerBase		' 5
{

 
private !
IAuthorizationService !!
_authorizationService" 7
;7 8
public 
#
AuthorizationController "
(" #!
IAuthorizationService# 8 
authorizationService9 M
)M N
{ !
_authorizationService 
=  
authorizationService  4
;4 5
} 
[ 
HttpPost 
] 
public 

async 
Task 
< 
IActionResult #
># $
Post% )
() *
[* +
FromBody+ 3
]3 4
PostTokenDTO5 A
dtoB E
)E F
{ 
var 
retorno 
= 
await !
_authorizationService 1
.1 2
	PostToken2 ;
(; <
(< =
dto= @
)@ A
)A B
;B C
return 
Ok 
( 
retorno 
) 
; 
} 
} 