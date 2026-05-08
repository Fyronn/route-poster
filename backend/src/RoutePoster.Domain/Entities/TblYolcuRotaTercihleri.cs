using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblYolcuRotaTercihleri
{
    public int TercihId { get; set; }

    public int? YolcuId { get; set; }

    public int? RotaId { get; set; }

    public int? BinisDurakId { get; set; }

    public int? InisDurakId { get; set; }

    public bool? VarsayilanKullanici { get; set; }

    public bool? AktifMi { get; set; }

    public virtual TblDuraklar? BinisDurak { get; set; }

    public virtual TblDuraklar? InisDurak { get; set; }

    public virtual TblRotalar? Rota { get; set; }

    public virtual TblKullanicilar? Yolcu { get; set; }
}
